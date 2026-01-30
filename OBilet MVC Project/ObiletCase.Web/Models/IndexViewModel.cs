using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace ObiletCase.Web.Models;

/// <summary>
/// Ana sayfa arama formu için ViewModel
/// </summary>
public class IndexViewModel
{
    /// <summary>
    /// Kalkış noktası ID
    /// </summary>
    [Required(ErrorMessage = "Lütfen kalkış noktası seçiniz.")]
    [Range(1, int.MaxValue, ErrorMessage = "Geçerli bir kalkış noktası seçiniz.")]
    public int OriginId { get; set; }
    
    /// <summary>
    /// Varış noktası ID
    /// </summary>
    [Required(ErrorMessage = "Lütfen varış noktası seçiniz.")]
    [Range(1, int.MaxValue, ErrorMessage = "Geçerli bir varış noktası seçiniz.")]
    public int DestinationId { get; set; }
    
    /// <summary>
    /// Gidiş tarihi
    /// </summary>
    [Required(ErrorMessage = "Lütfen tarih seçiniz.")]
    [DataType(DataType.Date)]
    public DateTime DepartureDate { get; set; } = DateTime.Today.AddDays(1);

    /// <summary>
    /// Kalkış noktası adı
    /// </summary>
    public string OriginName { get; set; } = "";
    
    /// <summary>
    /// Varış noktası adı
    /// </summary>
    public string DestinationName { get; set; } = "";

    /// <summary>
    /// Kalkış noktası seçenekleri
    /// </summary>
    public List<SelectListItem> OriginLocations { get; set; } = new();

    /// <summary>
    /// Varış noktası seçenekleri
    /// </summary>
    public List<SelectListItem> DestinationLocations { get; set; } = new();
    
    /// <summary>
    /// Hata mesajı (varsa)
    /// </summary>
    public string? ErrorMessage { get; set; }
    
    /// <summary>
    /// Kalkış ve varış noktalarının farklı olup olmadığını kontrol eder
    /// </summary>
    public bool IsValid => OriginId != DestinationId && DepartureDate.Date >= DateTime.Today;
}