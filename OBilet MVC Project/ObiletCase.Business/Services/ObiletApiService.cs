using System.Text;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ObiletCase.Core.Constants;
using ObiletCase.Core.DTOs;
using ObiletCase.Core.Interfaces;

namespace ObiletCase.Business.Services;

public class ObiletApiService : IObiletApiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    
    // API Ayarları
    private readonly string _apiBaseUrl;
    private readonly string _authToken;

    public ObiletApiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;

        // Ayarları AppSettings'ten oku
        _apiBaseUrl = _configuration["ObiletApi:BaseUrl"] 
                      ?? throw new InvalidOperationException("API Base URL bulunamadı!");
        
        _authToken = _configuration["ObiletApi:AuthToken"] 
                     ?? throw new InvalidOperationException("API Auth Token bulunamadı!");

        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Basic {_authToken}");
    }

    private async Task<T?> PostRequestAsync<T>(string endpoint, object data)
    {
        var jsonContent = JsonConvert.SerializeObject(data);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        try
        {
            var fullUrl = $"{_apiBaseUrl.TrimEnd('/')}/{endpoint}";
            var response = await _httpClient.PostAsync(fullUrl, content);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                // Hata durumunda konsola detaylı bilgi bas
                Console.WriteLine($"[API ERROR] {endpoint} ({response.StatusCode})");
                Console.WriteLine($"[RESPONSE] {responseString}");
                return default;
            }

            return JsonConvert.DeserializeObject<T>(responseString);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[EXCEPTION] {endpoint}: {ex.Message}");
            return default;
        }
    }

    public async Task<BaseResponse<SessionData>?> GetSessionAsync()
    {
        var request = new SessionRequest();
        return await PostRequestAsync<BaseResponse<SessionData>>(ApiConstants.Endpoints.GetSession, request);
    }

    public async Task<BaseResponse<List<BusLocation>>?> GetBusLocationsAsync(string sessionId, string deviceId, string? query = null)
    {
        var requestBody = new BusLocationRequest
        {
            Data = query,
            DeviceSession = new DeviceSession 
            { 
                SessionId = sessionId, 
                DeviceId = deviceId 
            },
            Date = DateTime.Now,
            Language = ApiConstants.Defaults.Language
        };

        return await PostRequestAsync<BaseResponse<List<BusLocation>>>(ApiConstants.Endpoints.GetBusLocations, requestBody);
    }

    public async Task<BaseResponse<List<JourneyResponse>>?> GetJourneysAsync(BusJourneyRequest request, string sessionId, string deviceId)
    {
        // API'nin beklediği sarmalayıcı (wrapper) modeli
        var requestBody = new BusLookupRequest
        {
            DeviceSession = new DeviceSession 
            { 
                SessionId = sessionId, 
                DeviceId = deviceId 
            },
            Date = DateTime.Now,
            Language = ApiConstants.Defaults.Language,
            Data = request // Kullanıcının seçtiği Origin, Destination ve Tarih bilgisi
        };

        return await PostRequestAsync<BaseResponse<List<JourneyResponse>>>(ApiConstants.Endpoints.GetBusJourneys, requestBody);
    }
}