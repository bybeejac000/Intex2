using CineNiche.Data;
using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;
using System.Security.Claims;
using System.Security.Policy;


namespace CineNiche.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class CineNicheController : ControllerBase
    {
        private MovieDbContext _movieContext;

        private readonly ApplicationDbContext _identityContext;

        public CineNicheController(MovieDbContext temp, ApplicationDbContext identityContext) {
            _movieContext = temp;
            _identityContext = identityContext;
        }

        [HttpGet("is-admin")]
        public IActionResult IsAdmin()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = _identityContext.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(new { isAdmin = user.UserRole == 1 });
        }

        [HttpGet("GetMovies")]
        public IActionResult GetMovies(int pageSize = 10, int pageNum = 1, string? sortOrder = null, [FromQuery] List<string>? categories = null, string? searchTerm = null)
        {
            var query = _movieContext.Titles
                .Include(t => t.Ratings)
                .AsQueryable();

            // Apply search filtering
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(m => m.title.ToLower().Contains(searchTerm.ToLower()));
            }

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

            //// Apply sorting based on sortOrder
            //if (!string.IsNullOrEmpty(sortOrder))
            //{
            //    query = sortOrder.ToLower() == "desc"
            //        ? query.OrderByDescending(m => m.title)
            //        : query.OrderBy(m => m.title);
            //}

            if (!string.IsNullOrEmpty(sortOrder))
            {
                switch (sortOrder.ToLower())
                {
                    case "desc":
                        query = query.OrderByDescending(m => m.title);
                        break;
                    case "asc":
                        query = query.OrderBy(m => m.title);
                        break;
                    case "averagerating_desc":
                        query = query.OrderByDescending(m => m.Ratings.Any() ? m.Ratings.Average(r => r.rating) : 0);
                        break;
                    case "averagerating_asc":
                        query = query.OrderBy(m => m.Ratings.Any() ? m.Ratings.Average(r => r.rating) : 0);
                        break;
                    case "numratings_desc":
                        query = query.OrderByDescending(m => m.Ratings.Count());
                        break;
                    case "numratings_asc":
                        query = query.OrderBy(m => m.Ratings.Count());
                        break;
                    default:
                        query = query.OrderBy(m => m.title); // default to ascending title
                        break;
                }
            }

            var totalNumMovies = query.Count();
           
            var movies = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new
                {
                    m.show_id,
                    m.title,
                    m.type,
                    m.director,
                    m.cast,
                    m.country,
                    m.release_year,
                    m.rating, // MPAA rating
                    m.duration,
                    m.description,
                    m.action,
                    m.adventure,
                    m.anime_series_international_tv_shows,
                    m.british_tv_shows_docuseries_international_tv_shows,
                    m. children,
                    m.comedies,
                    m.comedies_dramas_international_movies,
                    m.comedies_international_movies,
                    m.comedies_romantic_movies,
                    m.crime_tv_shows_docuseries,
                    m.documentaries,
                    m.documentaries_international_movies,
                    m.docuseries,
                    m.dramas,
                    m.dramas_international_movies,
                    m.dramas_romantic_movies,
                    m.family_movies,
                    m.fantasy,
                    m.horror_movies,
                    m.international_movies_thrillers,
                    m.international_tv_shows_romantic_tv_shows_tv_dramas,
                    m.kids_tv,
                    m.language_tv_shows,
                    m.musicals,
                    m.nature_tv,
                    m.reality_tv,
                    m.spirituality,
                    m.tv_action,
                    m.tv_comedies,
                    m.tv_dramas,
                    m.talk_shows_tv_comedies,
                    m.thrillers,
                    NumRatings = m.Ratings != null
                        ? m.Ratings.Count()
                        : 0,
                    AverageRating = m.Ratings != null && m.Ratings.Any() 
                        ? Math.Round(m.Ratings.Average(r => r.rating), 1) 
                        : 0
                })
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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }
            var user = _identityContext.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found");
            }
            // check of user has permission (UserRole == 1 = admin)
            if (user.UserRole != 1)
            {
                return Forbid("You are not authorized to add movies.");
            }
            
            _movieContext.Titles.Add(newMovie);
            _movieContext.SaveChanges();
            return Ok(newMovie);
        }

        [HttpPut("UpdateMovie/{showId}")]
        public IActionResult UpdateMovie(string showId, [FromBody] Title updatedMovie)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }
            var user = _identityContext.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found");
            }
            // check of user has permission (UserRole == 1 = admin)
            if (user.UserRole != 1)
            {
                return Forbid("You are not authorized to add movies.");
            }
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

        [HttpGet("GetId")]
        public List<User> GetId(string email)
        {
            List<User> user_data = _movieContext.Users.Where((r) => r.email == email).ToList();

            return user_data;
        }


        [HttpDelete("DeleteMovie/{showId}")]
        public IActionResult DeleteMovie(string showId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }
            var user = _identityContext.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found");
            }
            // check of user has permission (UserRole == 1 = admin)
            if (user.UserRole != 1)
            {
                return Forbid("You are not authorized to add movies.");
            }
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

        [HttpGet("GetMovie/{showId}")]
        public IActionResult GetMovie(string showId)
        {
            var movie = _movieContext.Titles
                .Include(m => m.Ratings)
                .FirstOrDefault(m => m.show_id == showId);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            var averageRating = movie.Ratings != null && movie.Ratings.Any()
                    ? Math.Round(movie.Ratings.Average(r => r.rating), 1)
                    : 0;

            var numRatings = movie.Ratings?.Count() ?? 0;

            var result = new
            {
                movie.show_id,
                movie.title,
                movie.director,
                movie.cast,
                movie.country,
                movie.description,
                movie.type,
                movie.duration,
                movie.release_year,
                movie.rating, // MPAA rating

                // Category fields if needed
                movie.action,
                movie.adventure,
                movie.anime_series_international_tv_shows,
                movie.british_tv_shows_docuseries_international_tv_shows,
                movie.children,
                movie.comedies,
                movie.comedies_dramas_international_movies,
                movie.comedies_international_movies,
                movie.comedies_romantic_movies,
                movie.crime_tv_shows_docuseries,
                movie.documentaries,
                movie.documentaries_international_movies,
                movie.docuseries,
                movie.dramas,
                movie.dramas_international_movies,
                movie.dramas_romantic_movies,
                movie.family_movies,
                movie.fantasy,
                movie.horror_movies,
                movie.international_movies_thrillers,
                movie.international_tv_shows_romantic_tv_shows_tv_dramas,
                movie.kids_tv,
                movie.language_tv_shows,
                movie.musicals,
                movie.nature_tv,
                movie.reality_tv,
                movie.spirituality,
                movie.tv_action,
                movie.tv_comedies,
                movie.tv_dramas,
                movie.talk_shows_tv_comedies,
                movie.thrillers,

                AverageRating = averageRating,
                NumRatings = numRatings
            };

            return Ok(result);
        }

        [HttpPost("AddRating")]
        public IActionResult AddRating([FromBody] Rating newRating)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = _identityContext.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            newRating.user_id = userId; // prevent spoofing

            _movieContext.Ratings.Add(newRating);
            _movieContext.SaveChanges();

            return Ok(newRating);
        }

    }
}
