using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CineNiche.Data
{
    [Table("movies_users")]
    public class User
    {
        [Key]
        [Required]
        public int user_id { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string phone { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public int age { get; set; }
        [Required]
        public string gender { get; set; }
        [Required]
        public int netflix { get; set; }
        [Required]
        public int amazon_prime { get; set; }
        [Required]
        public int disney_plus { get; set; }
        [Required]
        public int paramount_plus { get; set; }
        [Required]
        public int max {  get; set; }
        [Required]
        public int hulu { get; set; }
        [Required]
        public int apple_tv_plus { get; set; }
        [Required]
        public int peacock {  get; set; }
        [Required]
        public string city { get; set; }
        [Required]
        public string state { get; set; }
        [Required]
        public int zip { get; set; }
        [Required]
        public int user_role { get; set; }
    }
}
