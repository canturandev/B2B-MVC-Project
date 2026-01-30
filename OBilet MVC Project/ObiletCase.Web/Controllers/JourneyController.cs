using Microsoft.AspNetCore.Mvc;
using ObiletCase.Core.Constants;
using ObiletCase.Core.DTOs;
using ObiletCase.Core.Interfaces;
using ObiletCase.Web.Models;
using ObiletCase.Web.Services;

namespace ObiletCase.Web.Controllers;

/// <summary>
/// Sefer sonuçları controller'ı
/// </summary>
public class JourneyController : Controller
{
    private readonly IObiletApiService _obiletService;
    private readonly ISessionManager _sessionManager;
    private readonly ILogger<JourneyController> _logger;

    public JourneyController(
        IObiletApiService obiletService,
        ISessionManager sessionManager,
        ILogger<JourneyController> logger)
    {
        _obiletService = obiletService;
        _sessionManager = sessionManager;
        _logger = logger;
    }

    /// <summary>
    /// Sefer sonuçları sayfası
    /// </summary>
    /// <param name="originId">Kalkış noktası ID</param>
    /// <param name="destinationId">Varış noktası ID</param>
    /// <param name="date">Sefer tarihi</param>
    /// <param name="originName">Kalkış noktası adı</param>
    /// <param name="destinationName">Varış noktası adı</param>
    [HttpGet]
    public async Task<IActionResult> Index(int originId, int destinationId, DateTime date, 
        string? originName = null, string? destinationName = null)
    {
        var model = new JourneyIndexViewModel
        {
            OriginId = originId,
            DestinationId = destinationId,
            Date = date,
            OriginName = originName ?? "Kalkış Noktası",
            DestinationName = destinationName ?? "Varış Noktası"
        };

        try
        {
            // Session kontrolü
            if (!_sessionManager.HasValidSession())
            {
                _logger.LogWarning("Geçersiz session, ana sayfaya yönlendiriliyor.");
                return RedirectToAction("Index", "Home");
            }

            var (sessionId, deviceId) = await _sessionManager.GetOrCreateSessionAsync();
            
            if (string.IsNullOrEmpty(sessionId) || string.IsNullOrEmpty(deviceId))
            {
                return RedirectToAction("Index", "Home");
            }

            // Sefer isteği oluştur
            var request = new BusJourneyRequest
            {
                OriginId = originId,
                DestinationId = destinationId,
                DepartureDate = date
            };

            // Validasyon
            if (!request.IsValid)
            {
                _logger.LogWarning("Geçersiz sefer isteği: {Request}", request);
                model.ErrorMessage = "Geçersiz arama kriterleri.";
                return View(model);
            }

            // Seferleri çek
            _logger.LogInformation(
                "Sefer aranıyor: {OriginId} -> {DestinationId}, Tarih: {Date}",
                originId, destinationId, date.ToString("yyyy-MM-dd"));

            var response = await _obiletService.GetJourneysAsync(request, sessionId, deviceId);

            // Sonuçları işle ve sırala
            model.Journeys = ProcessJourneys(response?.Data);

            _logger.LogInformation("Toplam {Count} sefer bulundu.", model.JourneyCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Sefer arama sırasında hata oluştu.");
            model.ErrorMessage = "Seferler yüklenirken bir hata oluştu.";
        }

        return View(model);
    }

    #region Private Methods

    /// <summary>
    /// Seferleri işler, filtreler ve sıralar
    /// </summary>
    private static List<JourneyResponse> ProcessJourneys(List<JourneyResponse>? journeys)
    {
        if (journeys == null || !journeys.Any())
            return new List<JourneyResponse>();

        return journeys
            .Where(j => j.Journey != null) // Null journey'leri filtrele
            .OrderBy(j => j.Journey!.Departure) // Kalkış saatine göre sırala
            .ThenBy(j => j.DisplayPrice) // Aynı saatte ise fiyata göre sırala
            .ToList();
    }

    #endregion
}