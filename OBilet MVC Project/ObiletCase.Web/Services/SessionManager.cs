using Microsoft.AspNetCore.Http;
using ObiletCase.Core.Constants;
using ObiletCase.Core.DTOs;
using ObiletCase.Core.Interfaces;

namespace ObiletCase.Web.Services;

public interface ISessionManager
{
    Task<(string? SessionId, string? DeviceId)> GetOrCreateSessionAsync();
    bool HasValidSession();
    void ClearSession();
}

public class SessionManager : ISessionManager
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IObiletApiService _apiService;
    private readonly ILogger<SessionManager> _logger;

    private HttpContext HttpContext => _httpContextAccessor.HttpContext 
        ?? throw new InvalidOperationException("HttpContext mevcut değil.");

    public SessionManager(
        IHttpContextAccessor httpContextAccessor,
        IObiletApiService apiService,
        ILogger<SessionManager> logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _apiService = apiService;
        _logger = logger;
    }

    public async Task<(string? SessionId, string? DeviceId)> GetOrCreateSessionAsync()
    {
        var sessionId = GetCookieValue(CookieConstants.SessionId);
        var deviceId = GetCookieValue(CookieConstants.DeviceId);

        if (!string.IsNullOrEmpty(sessionId) && !string.IsNullOrEmpty(deviceId))
        {
            return (sessionId, deviceId);
        }

        _logger.LogInformation("Yeni session API'den isteniyor...");
        var response = await _apiService.GetSessionAsync();

        if (response?.Data?.IsValid == true)
        {
            sessionId = response.Data.SessionId;
            deviceId = response.Data.DeviceId;
            
            SaveSessionToCookies(sessionId!, deviceId!);
            _logger.LogInformation("Yeni session oluşturuldu ve kaydedildi: {SessionId}", sessionId);
            
            return (sessionId, deviceId);
        }

        _logger.LogWarning("Session oluşturulamadı!");
        return (null, null);
    }

    public bool HasValidSession()
    {
        var sessionId = GetCookieValue(CookieConstants.SessionId);
        var deviceId = GetCookieValue(CookieConstants.DeviceId);
        return !string.IsNullOrEmpty(sessionId) && !string.IsNullOrEmpty(deviceId);
    }

    public void ClearSession()
    {
        HttpContext.Response.Cookies.Delete(CookieConstants.SessionId);
        HttpContext.Response.Cookies.Delete(CookieConstants.DeviceId);
    }

    #region Private Methods

    private string? GetCookieValue(string key)
    {
        HttpContext.Request.Cookies.TryGetValue(key, out var value);
        return value;
    }

    private void SaveSessionToCookies(string sessionId, string deviceId)
    {
        var isHttps = HttpContext.Request.IsHttps;

        var options = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(CookieConstants.Expiration.SessionDays),
            HttpOnly = true,
            Secure = isHttps, // Sadece HTTPS ise Secure olsun, yoksa HTTP'de çalışmaz
            SameSite = SameSiteMode.Lax
        };

        HttpContext.Response.Cookies.Append(CookieConstants.SessionId, sessionId, options);
        HttpContext.Response.Cookies.Append(CookieConstants.DeviceId, deviceId, options);
    }

    #endregion
}