using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CineNiche.Data
{
    [Table("movies_titles")]
    public class Title
    {
        [Key]
        [Required]
        public string show_id { get; set; }
        [Required]
        public string type { get; set; }
        [Required]
        public string title { get; set; }
        public string? director { get; set; }
        public string? cast { get; set; }
        public string? country { get; set; }
        [Required]
        public int release_year { get; set; }
        public string? rating { get; set; }
        public string? duration { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public int action { get; set; }
        [Required]
        public int adventure { get; set; }
        [Required]
        public int anime_series_international_tv_shows { get; set; }
        [Required]
        public int british_tv_shows_docuseries_international_tv_shows { get; set; }
        [Required]
        public int children {  get; set; }  
        [Required]
        public int comedies { get; set; }
        [Required]
        public int comedies_dramas_international_movies { get; set; }
        [Required]
        public int comedies_international_movies { get; set; }
        [Required]
        public int comedies_romantic_movies { get; set; }
        [Required]
        public int crime_tv_shows_docuseries { get; set; }
        [Required]
        public int documentaries { get; set; }
        [Required]
        public int documentaries_international_movies { get; set; }
        [Required]
        public int docuseries { get; set; }
        [Required]
        public int dramas { get; set; }
        [Required]
        public int dramas_international_movies { get; set; }
        [Required]
        public int dramas_romantic_movies { get; set; }
        [Required]
        public int family_movies { get; set; }
        [Required]
        public int fantasy { get; set; }
        [Required]
        public int horror_movies { get; set; }
        [Required]
        public int international_movies_thrillers { get; set; }
        [Required]
        public int international_tv_shows_romantic_tv_shows_tv_dramas { get; set; }
        [Required]
        public int kids_tv { get; set; }
        [Required]
        public int language_tv_shows { get; set; }
        [Required]
        public int musicals {  get; set; }
        [Required]
        public int nature_tv {  get; set; }
        [Required]
        public int reality_tv { get; set; }
        [Required]
        public int spirituality {  get; set; }
        [Required]
        public int tv_action { get; set; }
        [Required]
        public int tv_comedies { get; set; }
        [Required]
        public int tv_dramas { get; set; }
        [Required]
        public int talk_shows_tv_comedies { get; set; }
        [Required]
        public int thrillers {  get; set; }
    }
}
