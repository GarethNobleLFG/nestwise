using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using User.Auth.Core.Interfaces;
using User.Auth.Core.Services;
using User.Auth.Infrastructure.Data;
using User.Auth.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure EF Core Pool with dynamic Environment fallback
var connectionString = Environment.GetEnvironmentVariable("DOTNET_POSTGRES_CONNECTION_STRING")
                       ?? builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? throw new InvalidOperationException("Connection string is missing.");

builder.Services.AddDbContextPool<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. Configure Dynamic CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 3. Setup JWT Bearer Authorization inside the pipeline (using AUTH_JWT_SECRET environment key or appsettings fallback)
var jwtSecret = Environment.GetEnvironmentVariable("AUTH_JWT_SECRET")
                ?? builder.Configuration["JwtSettings:SecretKey"]
                ?? throw new InvalidOperationException("JWT Secret Key is missing from settings.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// 4. Inject Dependencies
builder.Services.AddScoped<IPlanRepository, PlanRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPlanService, PlanService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-apply pending migrations on startup (runs inside Docker where postgres hostname resolves)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// 5. Build Middleware Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS early prior to routing
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 6. Global diagnostic and root status endpoints
app.MapGet("/", () => Results.Ok(new { service = "UserAuth", status = "running" }));
app.MapGet("/health", () => Results.Ok(new { status = "Healthy", service = "User.Auth", timestamp = DateTime.UtcNow }));

app.Run();