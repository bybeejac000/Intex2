using CineNiche.Data;
using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace CineNiche.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class CineNicheController : ControllerBase
    {
        private MovieDbContext _movieContext;

        public CineNicheController(MovieDbContext temp) => _movieContext = temp;

        [HttpGet("GetMovies")]
        public IActionResult GetMovies(int pageSize = 10, int pageNum = 1, string? sortOrder = null, [FromQuery] List<string>? categories = null)
        {
            var query = _movieContext.Titles.AsQueryable();

            // Apply category filtering based on passed categories
            if (categories != null && categories.Any())
            {
                var predicate = PredicateBuilder.New<Title>(false); // Start with false condition

                foreach (var category in categories)
                {
                    var propertyInfo = typeof(Title).GetProperty(category, System.Reflection.BindingFlags.IgnoreCase | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
                    if (propertyInfo != null)
                    {
                        predicate = predicate.Or(t => EF.Property<int>(t, propertyInfo.Name) == 1);
                    }
                }

                query = query.Where(predicate);
            }

            // Apply sorting based on sortOrder
            if (!string.IsNullOrEmpty(sortOrder))
            {
                query = sortOrder.ToLower() == "desc"
                    ? query.OrderByDescending(m => m.title)
                    : query.OrderBy(m => m.title);
            }

            var totalNumMovies = query.Count();
            var movies = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new
            {
                Movies = movies,
                TotalNumMovies = totalNumMovies
            });
        }

        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            // Get all public int properties that represent categories (exclude regular fields like show_id, title, etc.)
            var categoryProperties = typeof(Title).GetProperties()
                .Where(p => p.PropertyType == typeof(int) && p.Name != "release_year")
                .Select(p => p.Name)
                .ToList();

            return Ok(categoryProperties);
        }

        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] Title newMovie)
        {
            _movieContext.Titles.Add(newMovie);
            _movieContext.SaveChanges();
            return Ok(newMovie);
        }

        [HttpPut("UpdateMovie/{showId}")]
        public IActionResult UpdateMovie(string showId, [FromBody] Title updatedMovie)
        {
            var existingMovie = _movieContext.Titles.Find(showId);

            if (existingMovie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            // Update the fields of the existing movie
            existingMovie.type = updatedMovie.type;
            existingMovie.title = updatedMovie.title;
            existingMovie.director = updatedMovie.director;
            existingMovie.cast = updatedMovie.cast;
            existingMovie.country = updatedMovie.country;
            existingMovie.release_year = updatedMovie.release_year;
            existingMovie.rating = updatedMovie.rating;
            existingMovie.duration = updatedMovie.duration;
            existingMovie.description = updatedMovie.description;

            // Update category columns
            existingMovie.action = updatedMovie.action;
            existingMovie.adventure = updatedMovie.adventure;
            existingMovie.anime_series_international_tv_shows = updatedMovie.anime_series_international_tv_shows;
            existingMovie.british_tv_shows_docuseries_international_tv_shows = updatedMovie.british_tv_shows_docuseries_international_tv_shows;
            existingMovie.children = updatedMovie.children;
            existingMovie.comedies = updatedMovie.comedies;
            existingMovie.comedies_dramas_international_movies = updatedMovie.comedies_dramas_international_movies;
            existingMovie.comedies_international_movies = updatedMovie.comedies_international_movies;
            existingMovie.comedies_romantic_movies = updatedMovie.comedies_romantic_movies;
            existingMovie.crime_tv_shows_docuseries = updatedMovie.crime_tv_shows_docuseries;
            existingMovie.documentaries = updatedMovie.documentaries;
            existingMovie.documentaries_international_movies = updatedMovie.documentaries_international_movies;
            existingMovie.docuseries = updatedMovie.docuseries;
            existingMovie.dramas = updatedMovie.dramas;
            existingMovie.dramas_international_movies = updatedMovie.dramas_international_movies;
            existingMovie.dramas_romantic_movies = updatedMovie.dramas_romantic_movies;
            existingMovie.family_movies = updatedMovie.family_movies;
            existingMovie.fantasy = updatedMovie.fantasy;
            existingMovie.horror_movies = updatedMovie.horror_movies;
            existingMovie.international_movies_thrillers = updatedMovie.international_movies_thrillers;
            existingMovie.international_tv_shows_romantic_tv_shows_tv_dramas = updatedMovie.international_tv_shows_romantic_tv_shows_tv_dramas;
            existingMovie.kids_tv = updatedMovie.kids_tv;
            existingMovie.language_tv_shows = updatedMovie.language_tv_shows;
            existingMovie.musicals = updatedMovie.musicals;
            existingMovie.nature_tv = updatedMovie.nature_tv;
            existingMovie.reality_tv = updatedMovie.reality_tv;
            existingMovie.spirituality = updatedMovie.spirituality;
            existingMovie.tv_action = updatedMovie.tv_action;
            existingMovie.tv_comedies = updatedMovie.tv_comedies;
            existingMovie.tv_dramas = updatedMovie.tv_dramas;
            existingMovie.talk_shows_tv_comedies = updatedMovie.talk_shows_tv_comedies;
            existingMovie.thrillers = updatedMovie.thrillers;

            // Update the movie record
            _movieContext.Titles.Update(existingMovie);
            _movieContext.SaveChanges();

            return Ok(existingMovie);  // Return the updated movie
        }

        [HttpDelete("DeleteMovie/{showId}")]
        public IActionResult DeleteMovie(string showId)
        {
            var movie = _movieContext.Titles.Find(showId);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            // Remove the movie from the database
            _movieContext.Titles.Remove(movie);
            _movieContext.SaveChanges();

            return NoContent();  // Return a No Content status to indicate successful deletion
        }

    }
}
