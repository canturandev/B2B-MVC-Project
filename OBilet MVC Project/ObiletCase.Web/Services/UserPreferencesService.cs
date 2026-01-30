using Microsoft.AspNetCore.Http;
using ObiletCase.Core.Constants;

namespace ObiletCase.Web.Services;

/// <summary>
/// Kullanıcının son yaptığı aramaları Cookie üzerinde saklayan servis.
/// </summary>
public interface IUserPreferencesService
{
    /// <summary>
    /// Son seçilen kalkış noktasını getirir
    /// </summary>
    int? GetLastOriginId();
    
    /// <summary>
    /// Son seçilen varış noktasını getirir
    /// </summary>
    int? GetLastDestinationId();
    
    /// <summary>
    /// Son seçilen tarihi getirir
    /// </summary>
    DateTime? GetLastDate();
    
    /// <summary>
    /// Kullanıcı tercihlerini kaydeder
    /// </summary>
    void SavePreferences(int originId, int destinationId, DateTime date);
}

public class UserPreferencesService : IUserPreferencesService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    private HttpContext HttpContext => _httpContextAccessor.HttpContext 
        ?? throw new InvalidOperationException("HttpContext mevcut değil.");

    public UserPreferencesService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int? GetLastOriginId() => GetIntCookie(CookieConstants.LastOriginId);

    public int? GetLastDestinationId() => GetIntCookie(CookieConstants.LastDestinationId);

    public DateTime? GetLastDate()
    {
        if (HttpContext.Request.Cookies.TryGetValue(CookieConstants.LastDate, out var value) 
            && DateTime.TryParse(value, out var result))
        {
            return result;
        }
        return null;
    }

    public void SavePreferences(int originId, int destinationId, DateTime date)
    {
        var options = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(CookieConstants.Expiration.PreferencesDays),
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax
        };

        HttpContext.Response.Cookies.Append(CookieConstants.LastOriginId, originId.ToString(), options);
        HttpContext.Response.Cookies.Append(CookieConstants.LastDestinationId, destinationId.ToString(), options);
        HttpContext.Response.Cookies.Append(CookieConstants.LastDate, date.ToString("yyyy-MM-dd"), options);
    }

    private int? GetIntCookie(string key)
    {
        if (HttpContext.Request.Cookies.TryGetValue(key, out var value) && int.TryParse(value, out var result))
        {
            return result;
        }
        return null;
    }
}
