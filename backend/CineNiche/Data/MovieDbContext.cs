using Microsoft.EntityFrameworkCore;

namespace CineNiche.Data
{
    public class MovieDbContext : DbContext
    {
        public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options) 
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Title> Titles { get; set; }
        public DbSet<Rating> Rating { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define composite primary key using user_id and show_id
            modelBuilder.Entity<Rating>()
                .HasKey(r => new { r.user_id, r.show_id });

            // Optionally, you can also configure relationships or other settings here
        }
    }
}
