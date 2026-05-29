using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User.Auth.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUsersAndIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Plans_UserEmail",
                table: "Plans",
                column: "UserEmail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Plans_UserEmail",
                table: "Plans");
        }
    }
}
