using Newtonsoft.Json;
using ObiletCase.Core.Constants;

namespace ObiletCase.Core.DTOs;

#region Request Models

/// <summary>
/// Session oluşturmak için API'ye gönderilecek istek modeli
/// </summary>
public class SessionRequest
{
    [JsonProperty("type")]
    public int Type { get; set; } = ApiConstants.Defaults.SessionType;

    [JsonProperty("connection")]
    public ConnectionInfo Connection { get; set; } = new();

    [JsonProperty("browser")]
    public BrowserInfo Browser { get; set; } = new();
    
    [JsonProperty("application")]
    public ApplicationInfo Application { get; set; } = new();
}

/// <summary>
/// Bağlantı bilgileri
/// </summary>
public class ConnectionInfo
{
    [JsonProperty("ip-address")]
    public string IpAddress { get; set; } = ApiConstants.Defaults.DefaultIpAddress;
    
    [JsonProperty("port")]
    public string Port { get; set; } = ApiConstants.Defaults.DefaultPort;
}

/// <summary>
/// Tarayıcı bilgileri
/// </summary>
public class BrowserInfo
{
    [JsonProperty("name")]
    public string Name { get; set; } = ApiConstants.Defaults.DefaultBrowserName;
    
    [JsonProperty("version")]
    public string Version { get; set; } = ApiConstants.Defaults.DefaultBrowserVersion;
}

/// <summary>
/// Uygulama bilgileri
/// </summary>
public class ApplicationInfo
{
    [JsonProperty("version")]
    public string Version { get; set; } = ApiConstants.Defaults.DefaultAppVersion;
    
    [JsonProperty("equipment-id")]
    public string EquipmentId { get; set; } = ApiConstants.Defaults.DefaultEquipmentId;
}

#endregion

#region Response Models

/// <summary>
/// Session API yanıtındaki data modeli
/// </summary>
public class SessionData
{
    [JsonProperty("session-id")]
    public string? SessionId { get; set; }

    [JsonProperty("device-id")]
    public string? DeviceId { get; set; }
    
    /// <summary>
    /// Session ve Device ID'nin geçerli (dolu) olup olmadığını kontrol eder.
    /// </summary>
    public bool IsValid => !string.IsNullOrEmpty(SessionId) && !string.IsNullOrEmpty(DeviceId);
}

#endregion