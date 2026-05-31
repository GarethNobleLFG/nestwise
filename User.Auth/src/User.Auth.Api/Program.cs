using Microsoft.EntityFrameworkCore;
using User.Auth.Core.Interfaces;
using User.Auth.Core.Services;
using User.Auth.Infrastructure.Data;
using User.Auth.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configure Entity Framework with PostgreSQL
builder.Services.AddDbContextPool<AppDbContext>(options => // By using pooling, we now recycle database contexts rather than creating and destroying a new one for every single HTTP request. This dramatically increases throughput under heavy loads.
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IPlanRepository, PlanRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IPlanService, PlanService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();