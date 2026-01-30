using Newtonsoft.Json;

namespace ObiletCase.Core.DTOs;

/// <summary>
/// Kalkış ve varış noktalarını temsil eden lokasyon modeli.
/// </summary>
public class BusLocation
{
    [JsonProperty("id")]
    public int Id { get; set; }

    [JsonProperty("parent-id")]
    public int? ParentId { get; set; }

    [JsonProperty("type")]
    public string? Type { get; set; }

    [JsonProperty("name")]
    public string? Name { get; set; }

    [JsonProperty("rank")]
    public int? Rank { get; set; }

    [JsonProperty("keywords")]
    public string? Keywords { get; set; }
    
    /// <summary>
    /// UI tarafında gösterilecek formatlı isim (Name boşsa ID döner).
    /// </summary>
    public string DisplayName => Name ?? $"Lokasyon #{Id}";
}

/// <summary>
/// Lokasyonları çekmek için kullanılan istek modeli
/// </summary>
public class BusLocationRequest
{
    [JsonProperty("data")]
    public string? Data { get; set; }

    [JsonProperty("device-session")]
    public DeviceSession? DeviceSession { get; set; }

    [JsonProperty("date")]
    public DateTime Date { get; set; }

    [JsonProperty("language")]
    public string? Language { get; set; }
}

public class DeviceSession
{
    [JsonProperty("session-id")]
    public string? SessionId { get; set; }

    [JsonProperty("device-id")]
    public string? DeviceId { get; set; }
}