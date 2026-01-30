namespace ObiletCase.Core.Extensions;

/// <summary>
/// DateTime için extension metodları
/// </summary>
public static class DateTimeExtensions
{
    /// <summary>
    /// Tarihi API için uygun formata çevirir (yyyy-MM-dd)
    /// </summary>
    public static string ToApiDateFormat(this DateTime date)
        => date.ToString("yyyy-MM-dd");
    
    /// <summary>
    /// Tarihi kullanıcı dostu formata çevirir (dd MMMM yyyy dddd)
    /// </summary>
    public static string ToDisplayFormat(this DateTime date)
        => date.ToString("dd MMMM yyyy dddd");
    
    /// <summary>
    /// Saati kullanıcı dostu formata çevirir (HH:mm)
    /// </summary>
    public static string ToTimeFormat(this DateTime date)
        => date.ToString("HH:mm");
    
    /// <summary>
    /// Tarihin bugün mü olduğunu kontrol eder
    /// </summary>
    public static bool IsToday(this DateTime date)
        => date.Date == DateTime.Today;
    
    /// <summary>
    /// Tarihin yarın mı olduğunu kontrol eder
    /// </summary>
    public static bool IsTomorrow(this DateTime date)
        => date.Date == DateTime.Today.AddDays(1);
}
