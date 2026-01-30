using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ObiletCase.Core.Extensions;
using ObiletCase.Core.Interfaces;
using ObiletCase.Web.Models;
using ObiletCase.Web.Services;

namespace ObiletCase.Web.Controllers;

/// <summary>
/// Ana sayfa controller'ı - Sefer arama işlemlerini yönetir
/// </summary>
public class HomeController : Controller
{
    private readonly IObiletApiService _obiletService;
    private readonly ISessionManager _sessionManager;
    private readonly IUserPreferencesService _preferencesService;
    private readonly ILogger<HomeController> _logger;

    public HomeController(
        IObiletApiService obiletService,
        ISessionManager sessionManager,
        IUserPreferencesService preferencesService,
        ILogger<HomeController> logger)
    {
        _obiletService = obiletService;
        _sessionManager = sessionManager;
        _preferencesService = preferencesService;
        _logger = logger;
    }

    /// <summary>
    /// Ana sayfa - Arama formu (GET)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var model = new IndexViewModel();
        
        try
        {
            // 1. Session Kontrolü
            var (sessionId, deviceId) = await _sessionManager.GetOrCreateSessionAsync();
            
            if (string.IsNullOrEmpty(sessionId) || string.IsNullOrEmpty(deviceId))
            {
                _logger.LogWarning("Session oluşturulamadı.");
                model.ErrorMessage = "Oturum başlatılamadı. Lütfen sayfayı yenileyin.";
                return View(model);
            }

            // 2. Lokasyonları Çek ve Listeyi Doldur
            await PopulateLocationsAsync(model, sessionId, deviceId);

            // 3. Kullanıcı Tercihlerini Yükle
            LoadUserPreferences(model);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ana sayfa yüklenirken hata oluştu.");
            model.ErrorMessage = "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
        }

        return View(model);
    }

    /// <summary>
    /// Arama formu gönderimi (POST)
    /// </summary>
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Index(IndexViewModel model)
    {
        // 1. Model null gelirse (Defensive)
        if (model == null) return RedirectToAction(nameof(Index));

        var (sessionId, deviceId) = await _sessionManager.GetOrCreateSessionAsync();

        // 2. Session kaybolmuşsa hata ver
        if (string.IsNullOrEmpty(sessionId) || string.IsNullOrEmpty(deviceId))
        {
            model.ErrorMessage = "Oturum süresi doldu. Lütfen sayfayı yenileyin.";
            return View(model);
        }

        // 3. VALIDATION KONTROLÜ
        if (!ModelState.IsValid)
        {
            // Hataları logla (Hangi alanın boş geldiğini görmek için)
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
            _logger.LogWarning("Validation Hatası: {Errors}", string.Join(", ", errors));

            // Kullanıcıya hata mesajı göster
            model.ErrorMessage = "Lütfen kalkış ve varış noktalarını seçtiğinizden emin olun.";

            // Dropdownları tekrar doldur (Yoksa liste boş gelir!)
            await PopulateLocationsAsync(model, sessionId, deviceId);

            return View(model);
        }

        // 4. Mantıksal Kontroller
        if (model.OriginId == model.DestinationId)
        {
            TempData["Error"] = "Kalkış ve varış noktası aynı olamaz!";
            await PopulateLocationsAsync(model, sessionId, deviceId); // Listeleri doldur
            return View(model);
        }

        if (model.DepartureDate.Date < DateTime.Today)
        {
            TempData["Error"] = "Geçmiş bir tarih seçemezsiniz!";
            await PopulateLocationsAsync(model, sessionId, deviceId); // Listeleri doldur
            return View(model);
        }

        // 5. Tercihleri Kaydet
        _preferencesService.SavePreferences(model.OriginId, model.DestinationId, model.DepartureDate);
        
        // 6. Şehir İsimlerini Bul (Eğer JS tarafında doldurulmadıysa)
        if (string.IsNullOrWhiteSpace(model.OriginName) || string.IsNullOrWhiteSpace(model.DestinationName))
        {
            await EnsureLocationNamesAsync(model, sessionId, deviceId);
        }

        // 7. Yönlendirme
        return RedirectToAction("Index", "Journey", new 
        { 
            originId = model.OriginId, 
            destinationId = model.DestinationId, 
            date = model.DepartureDate.ToApiDateFormat(),
            originName = model.OriginName,
            destinationName = model.DestinationName
        });
    }

    public IActionResult Privacy() => View();

    #region Private Helper Methods

    /// <summary>
    /// Dropdown listelerini API'den çekip dolduran yardımcı method
    /// </summary>
    private async Task PopulateLocationsAsync(IndexViewModel model, string sessionId, string deviceId)
    {
        try 
        {
            var locationsResponse = await _obiletService.GetBusLocationsAsync(sessionId, deviceId);
            var locations = locationsResponse?.Data ?? new();

            if (locations.Any())
            {
                var items = locations
                    .OrderBy(l => l.Rank) // Varsa rank'a göre, yoksa isme göre
                    .ThenBy(l => l.Name)
                    .Select(l => new SelectListItem 
                    { 
                        Text = l.DisplayName, 
                        Value = l.Id.ToString() 
                    })
                    .ToList();

                model.OriginLocations = items;
                model.DestinationLocations = new List<SelectListItem>(items);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lokasyonlar doldurulurken hata oluştu.");
        }
    }

    /// <summary>
    /// Eğer POST işleminde şehir isimleri gelmediyse, ID'den isimleri bulur.
    /// </summary>
    private async Task EnsureLocationNamesAsync(IndexViewModel model, string sessionId, string deviceId)
    {
        try
        {
            var locationsResponse = await _obiletService.GetBusLocationsAsync(sessionId, deviceId);
            var locations = locationsResponse?.Data ?? new();

            var origin = locations.FirstOrDefault(l => l.Id == model.OriginId);
            var destination = locations.FirstOrDefault(l => l.Id == model.DestinationId);

            if (origin != null && string.IsNullOrWhiteSpace(model.OriginName))
                model.OriginName = origin.DisplayName;

            if (destination != null && string.IsNullOrWhiteSpace(model.DestinationName))
                model.DestinationName = destination.DisplayName;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Lokasyon isimleri lookup yapılırken hata oluştu.");
        }
    }

    /// <summary>
    /// Kullanıcı tercihlerini model'e yükler
    /// </summary>
    private void LoadUserPreferences(IndexViewModel model)
    {
        var lastOrigin = _preferencesService.GetLastOriginId();
        var lastDestination = _preferencesService.GetLastDestinationId();
        var lastDate = _preferencesService.GetLastDate();

        if (lastOrigin.HasValue) model.OriginId = lastOrigin.Value;
        if (lastDestination.HasValue) model.DestinationId = lastDestination.Value;
        if (lastDate.HasValue && lastDate.Value.Date >= DateTime.Today) model.DepartureDate = lastDate.Value;
    }

    #endregion
}