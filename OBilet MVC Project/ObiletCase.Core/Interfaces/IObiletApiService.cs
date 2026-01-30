using ObiletCase.Core.DTOs;

namespace ObiletCase.Core.Interfaces;

/// <summary>
/// Obilet API ile iletişim kuran servis arayüzü
/// </summary>
public interface IObiletApiService
{
    /// <summary>
    /// API üzerinden yeni bir oturum (Session) başlatır.
    /// </summary>
    /// <returns>SessionId ve DeviceId içeren oturum verisi.</returns>
    Task<BaseResponse<SessionData>?> GetSessionAsync();

    /// <summary>
    /// Otobüs duraklarını/lokasyonlarını getirir
    /// </summary>
    /// <param name="sessionId">Aktif session ID</param>
    /// <param name="deviceId">Cihaz ID</param>
    /// <param name="query">Arama sorgusu (opsiyonel)</param>
    /// <returns>Lokasyon listesi</returns>
    Task<BaseResponse<List<BusLocation>>?> GetBusLocationsAsync(
        string sessionId, 
        string deviceId, 
        string? query = null);
    
    /// <summary>
    /// Belirtilen kriterlere göre otobüs seferlerini listeler.
    /// </summary>
    /// <param name="request">Arama kriterleri</param>
    /// <param name="sessionId">Aktif session ID</param>
    /// <param name="deviceId">Cihaz ID</param>
    /// <returns>Sefer listesi</returns>
    Task<BaseResponse<List<JourneyResponse>>?> GetJourneysAsync(
        BusJourneyRequest request, 
        string sessionId, 
        string deviceId);
}