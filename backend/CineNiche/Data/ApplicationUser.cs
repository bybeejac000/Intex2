using Microsoft.AspNetCore.Identity;

namespace CineNiche.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        
        public int ProfilePictureId { get; set; } = 0;
        public int UserRole { get; set; } = 0;
    }
}
