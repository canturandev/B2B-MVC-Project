using Newtonsoft.Json;

namespace ObiletCase.Core.DTOs;

/// <summary>
/// API yanıtları için genel wrapper sınıfı
/// </summary>
/// <typeparam name="T">Data tipi</typeparam>
public class BaseResponse<T>
{
    [JsonProperty("status")]
    public string? Status { get; set; } 

    [JsonProperty("message")]
    public string? Message { get; set; }
    
    [JsonProperty("user-message")]
    public string? UserMessage { get; set; } 

    [JsonProperty("data")]
    public T? Data { get; set; }
    
    /// <summary>
    /// Yanıtın başarılı olup olmadığını kontrol eder
    /// </summary>
    public bool IsSuccess => Status?.Equals("Success", StringComparison.OrdinalIgnoreCase) ?? Data != null;
    
    /// <summary>
    /// Gösterilecek hata mesajını döner
    /// </summary>
    public string ErrorMessage => UserMessage ?? Message ?? "Bilinmeyen bir hata oluştu.";
}