using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CineNiche.Data
{
    [Table("movies_ratings")]
    public class Rating
    {
        [Required]
        [ForeignKey("User")]
        public int user_id { get; set; }
        [Required]
        public virtual User User { get; set; }
        [Required]
        [ForeignKey("Title")]
        public string show_id { get; set; }
        [Required]
        public virtual Title Title { get; set; }
        [Required]
        public int rating { get; set; }
    }
}
