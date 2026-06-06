using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using User.Auth.Core.Entities;

namespace User.Auth.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Plan> Plans { get; set; }
        public DbSet<Core.Entities.User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                entity.SetTableName(ToSnakeCase(entity.GetTableName() ?? ""));

                foreach (var property in entity.GetProperties())
                    property.SetColumnName(ToSnakeCase(property.Name));

                foreach (var key in entity.GetKeys())
                    key.SetName(ToSnakeCase(key.GetName() ?? ""));

                foreach (var fk in entity.GetForeignKeys())
                    fk.SetConstraintName(ToSnakeCase(fk.GetConstraintName() ?? ""));

                foreach (var index in entity.GetIndexes())
                    index.SetDatabaseName(ToSnakeCase(index.GetDatabaseName() ?? ""));
            }

            modelBuilder.Entity<Core.Entities.User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Plan>()
                .HasIndex(p => p.UserEmail);
        }

        private static string ToSnakeCase(string input) =>
            string.IsNullOrEmpty(input) ? input : Regex.Replace(input, "([a-z0-9])([A-Z])", "$1_$2").ToLower();
    }
}
