using Newtonsoft.Json;
using ObiletCase.Core.Extensions;

namespace ObiletCase.Core.DTOs;

#region Request Models

/// <summary>
/// Sefer araması için gerekli parametreleri içeren istek modeli.
/// </summary>
public class BusJourneyRequest
{
    [JsonProperty("origin-id")]
    public int OriginId { get; set; }

    [JsonProperty("destination-id")]
    public int DestinationId { get; set; }

    [JsonProperty("departure-date")]
    public DateTime DepartureDate { get; set; }
    
    /// <summary>
    /// Arama parametrelerinin tutarlılığını kontrol eder.
    /// </summary>
    public bool IsValid => OriginId > 0 && 
                          DestinationId > 0 && 
                          OriginId != DestinationId &&
                          DepartureDate.Date >= DateTime.Today;
}

#endregion

#region Response Models

/// <summary>
/// API'den dönen sefer bilgisidir.
/// </summary>
public class JourneyResponse
{
    [JsonProperty("id")]
    public string? Id { get; set; }

    [JsonProperty("partner-id")]
    public int? PartnerId { get; set; }

    [JsonProperty("partner-name")]
    public string? PartnerName { get; set; }

    [JsonProperty("internet-price")]
    public decimal? InternetPrice { get; set; }

    [JsonProperty("bus-type")]
    public string? BusType { get; set; }

    [JsonProperty("journey")]
    public JourneyDetail? Journey { get; set; }
    
    /// <summary>
    /// Gösterilecek fiyatı döner (İnternet fiyatı önceliklidir)
    /// </summary>
    public decimal DisplayPrice => InternetPrice ?? Journey?.OriginalPrice ?? 0;
    
    /// <summary>
    /// Partner logo URL'ini döner
    /// </summary>
    public string PartnerLogoUrl => PartnerId.HasValue 
        ? $"https://s3.eu-central-1.amazonaws.com/static.obilet.com/images/partner/{PartnerId}-sm.png" 
        : string.Empty;
}

/// <summary>
/// Seferin detaylarını (saat, durak, süre) içeren model.
/// </summary>
public class JourneyDetail
{
    [JsonProperty("origin")]
    public string? Origin { get; set; }

    [JsonProperty("destination")]
    public string? Destination { get; set; }

    [JsonProperty("departure")]
    public DateTime Departure { get; set; }

    [JsonProperty("arrival")]
    public DateTime Arrival { get; set; }

    [JsonProperty("currency")]
    public string? Currency { get; set; }

    [JsonProperty("duration")]
    public string? Duration { get; set; }
    
    [JsonProperty("original-price")]
    public decimal OriginalPrice { get; set; }
    
    [JsonProperty("stops")]
    public List<JourneyStop>? Stops { get; set; }
    
    /// <summary>
    /// Kalkış, varış saatini formatlı döner
    /// </summary>
    public string DepartureTime => Departure.ToTimeFormat();
    public string ArrivalTime => Arrival.ToTimeFormat();
    
    /// <summary>
    /// Para birimini döner
    /// </summary>
    public string DisplayCurrency => Currency ?? "TRY";
    
    /// <summary>
    /// Durak Bilgilerini döner
    /// </summary>
    public JourneyStop? OriginStop => Stops?.FirstOrDefault(s => s.IsOrigin);
    public JourneyStop? DestinationStop => Stops?.FirstOrDefault(s => s.IsDestination);
}

public class JourneyStop
{
    [JsonProperty("id")]
    public int Id { get; set; }
    
    [JsonProperty("name")]
    public string? Name { get; set; }
    
    [JsonProperty("station")]
    public string? Station { get; set; }
    
    [JsonProperty("time")]
    public DateTime? Time { get; set; }
    
    [JsonProperty("is-origin")]
    public bool IsOrigin { get; set; }
    
    [JsonProperty("is-destination")]
    public bool IsDestination { get; set; }
    
    [JsonProperty("station-address")]
    public string? StationAddress { get; set; }
    
    [JsonProperty("station-phone")]
    public string? StationPhone { get; set; }
    
    [JsonProperty("index")]
    public int Index { get; set; }
}

/// <summary>
/// Seferleri API'den çekmek için kullanılan sarmalayıcı (wrapper) istek modeli.
/// </summary>
public class BusLookupRequest
{
    [JsonProperty("device-session")]
    public DeviceSession DeviceSession { get; set; } = new();

    [JsonProperty("date")]
    public DateTime Date { get; set; }

    [JsonProperty("language")]
    public string Language { get; set; } = "tr-TR";

    [JsonProperty("data")]
    public BusJourneyRequest? Data { get; set; }
}

#endregion