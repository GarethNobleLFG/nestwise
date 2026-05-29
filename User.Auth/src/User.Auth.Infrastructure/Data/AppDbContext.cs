using Microsoft.EntityFrameworkCore;
using User.Auth.Core.Entities;

namespace User.Auth.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Plan> Plans { get; set; }
        public DbSet<Core.Entities.User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Core.Entities.User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Regular index on Plans to speed up User Plan Retrieval
            modelBuilder.Entity<Plan>()
                .HasIndex(p => p.UserEmail);
        }
    }
}