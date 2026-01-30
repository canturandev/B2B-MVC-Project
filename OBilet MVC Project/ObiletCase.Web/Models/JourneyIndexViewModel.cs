using ObiletCase.Core.DTOs;
using ObiletCase.Core.Extensions;

namespace ObiletCase.Web.Models;

/// <summary>
/// Sefer sonuçları sayfası için ViewModel
/// </summary>
public class JourneyIndexViewModel
{
    /// <summary>
    /// Kalkış noktası ID
    /// </summary>
    public int OriginId { get; set; }
    
    /// <summary>
    /// Varış noktası ID
    /// </summary>
    public int DestinationId { get; set; }
    
    /// <summary>
    /// Kalkış noktası adı
    /// </summary>
    public string OriginName { get; set; } = "Kalkış Noktası";
    
    /// <summary>
    /// Varış noktası adı
    /// </summary>
    public string DestinationName { get; set; } = "Varış Noktası";
    
    /// <summary>
    /// Kalkış noktası adı (Origin alias)
    /// </summary>
    public string Origin => OriginName;
    
    /// <summary>
    /// Varış noktası adı (Destination alias)
    /// </summary>
    public string Destination => DestinationName;
    
    /// <summary>
    /// Sefer tarihi
    /// </summary>
    public DateTime Date { get; set; }
    
    /// <summary>
    /// Sefer listesi
    /// </summary>
    public List<JourneyResponse> Journeys { get; set; } = new();
    
    /// <summary>
    /// Hata mesajı (varsa)
    /// </summary>
    public string? ErrorMessage { get; set; }
    
    #region Computed Properties
    
    /// <summary>
    /// Sefer var mı?
    /// </summary>
    public bool HasJourneys => Journeys.Any();
    
    /// <summary>
    /// Toplam sefer sayısı
    /// </summary>
    public int JourneyCount => Journeys.Count;
    
    /// <summary>
    /// Tarih formatlanmış hali
    /// </summary>
    public string FormattedDate => Date.ToDisplayFormat();
    
    /// <summary>
    /// API formatında tarih
    /// </summary>
    public string ApiFormattedDate => Date.ToApiDateFormat();
    
    /// <summary>
    /// En ucuz sefer fiyatı
    /// </summary>
    public decimal? MinPrice => Journeys.Any() ? Journeys.Min(j => j.DisplayPrice) : null;
    
    /// <summary>
    /// En pahalı sefer fiyatı
    /// </summary>
    public decimal? MaxPrice => Journeys.Any() ? Journeys.Max(j => j.DisplayPrice) : null;
    
    #endregion
}