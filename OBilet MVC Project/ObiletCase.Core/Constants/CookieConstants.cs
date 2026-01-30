namespace ObiletCase.Core.Constants;

/// <summary>
/// Cookie anahtarları ve süreleri
/// </summary>
public static class CookieConstants
{
    public const string SessionId = "ObiletSessionId";
    public const string DeviceId = "ObiletDeviceId";
    public const string LastOriginId = "LastOriginId";
    public const string LastDestinationId = "LastDestinationId";
    public const string LastDate = "LastDate";
    
    public static class Expiration
    {
        public const int SessionDays = 1;
        public const int PreferencesDays = 7;
    }
}
