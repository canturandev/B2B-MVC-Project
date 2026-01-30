namespace ObiletCase.Core.Constants;

/// <summary>
/// API ile ilgili varsayılan değerler
/// </summary>
public static class ApiConstants
{
    public const string BaseUrl = "ObiletApi:BaseUrl";
    public const string AuthToken = "ObiletApi:AuthToken";
    
    public static class Endpoints
    {
        public const string GetSession = "client/getsession";
        public const string GetBusLocations = "location/getbuslocations";
        public const string GetBusJourneys = "journey/getbusjourneys";
    }
    
    public static class Defaults
    {
        public const string Language = "tr-TR";
        public const int SessionType = 7; // Web browser
        public const string DefaultIpAddress = "127.0.0.1";
        public const string DefaultPort = "5117";
        public const string DefaultBrowserName = "Safari";
        public const string DefaultBrowserVersion = "120.0.0.0";
        public const string DefaultAppVersion = "1.0.0.0";
        public const string DefaultEquipmentId = "distribusion";
    }
}
