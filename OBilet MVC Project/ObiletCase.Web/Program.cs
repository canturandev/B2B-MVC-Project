using ObiletCase.Business.Services;
using ObiletCase.Core.Interfaces;
using ObiletCase.Web.Services;

var builder = WebApplication.CreateBuilder(args);

#region Service Registration

// MVC
builder.Services.AddControllersWithViews();

// HttpClient
builder.Services.AddHttpClient();

// HttpContext Accessor (Session Manager için gerekli)
builder.Services.AddHttpContextAccessor();

// API Servisi
builder.Services.AddScoped<IObiletApiService, ObiletApiService>();

// Custom Servisler
builder.Services.AddScoped<ISessionManager, SessionManager>();
builder.Services.AddScoped<IUserPreferencesService, UserPreferencesService>();

#endregion

var app = builder.Build();

#region Middleware Pipeline

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

#endregion

app.Run();
