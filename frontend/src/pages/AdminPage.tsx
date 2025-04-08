import { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import { deleteMovie, fetchMovies } from "../api/MoviesAPI";
import NewMovieForm from "../components/NewMovieForm";
import EditMovieForm from "../components/EditMovieForm";
import Pagination from "../components/Pagination";

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Fetch movies on page change, sort change, and page size change
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies(
          pageSize,
          pageNum,
          selectedCategories,
          sortOrder
        );
        setMovies(data.movies);
        setTotalPages(Math.ceil(data.totalNumMovies / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [pageSize, pageNum, sortOrder, selectedCategories]);

  const handleDelete = async (show_id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (!confirmDelete) return;

    try {
      await deleteMovie(show_id);
      setMovies(movies.filter((m) => m.show_id !== show_id));
    } catch (error) {
      alert("Failed to delete movie. Please try again.");
    }
  };

  if (loading) return <p>Loading Movies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1>Admin - Movies</h1>

      {/* Sorting Buttons */}
      <div>
        <button onClick={() => setSortOrder(null)}>Default Order</button>
        <button onClick={() => setSortOrder("asc")}>Sort A → Z</button>
        <button onClick={() => setSortOrder("desc")}>Sort Z → A</button>
      </div>

      {/* Category Filters (Example of using checkboxes to select categories) */}
      <div>
        <h3>Filter by Categories</h3>
        {/* Example checkboxes for categories */}
        <label>
          <input
            type="checkbox"
            checked={selectedCategories.includes("action")}
            onChange={() =>
              setSelectedCategories((prevCategories) =>
                prevCategories.includes("action")
                  ? prevCategories.filter((cat) => cat !== "action")
                  : [...prevCategories, "action"]
              )
            }
          />
          Action
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedCategories.includes("comedy")}
            onChange={() =>
              setSelectedCategories((prevCategories) =>
                prevCategories.includes("comedy")
                  ? prevCategories.filter((cat) => cat !== "comedy")
                  : [...prevCategories, "comedy"]
              )
            }
          />
          Comedy
        </label>
        {/* Add more categories as needed */}
      </div>

      <br />

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Movie
        </button>
      )}

      {showForm && (
        <NewMovieForm
          onSuccess={() => {
            setShowForm(false);
            fetchMovies(pageSize, pageNum, selectedCategories, sortOrder).then(
              (data) => setMovies(data.movies)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingMovie && (
        <EditMovieForm
          movie={editingMovie}
          onSuccess={() => {
            setEditingMovie(null);
            fetchMovies(pageSize, pageNum, selectedCategories, sortOrder).then(
              (data) => setMovies(data.movies)
            );
          }}
          onCancel={() => setEditingMovie(null)}
        />
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Show ID</th>
            <th>Title</th>
            <th>Director</th>
            <th>Cast</th>
            <th>Country</th>
            <th>Release Year</th>
            <th>Rating</th>
            <th>Duration</th>
            <th>Genres</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m.show_id}>
              <td>{m.show_id}</td>
              <td>{m.title}</td>
              <td>{m.director}</td>
              <td>{m.cast}</td>
              <td>{m.country}</td>
              <td>{m.release_year}</td>
              <td>{m.rating}</td>
              <td>{m.duration}</td>
              <td>
                {/* Render genres as a list of genre names */}
                <ul>
                  {Object.keys(m).map((key) => {
                    if (
                      key !== "show_id" &&
                      key !== "title" &&
                      key !== "director" &&
                      key !== "cast" &&
                      key !== "country" &&
                      key !== "release_year" &&
                      key !== "rating" &&
                      key !== "duration"
                    ) {
                      return m[key as keyof Movie] === 1 ? (
                        <li key={key}>{key}</li>
                      ) : null;
                    }
                    return null;
                  })}
                </ul>
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingMovie(m)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => handleDelete(m.show_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
  );
};

export default AdminMoviesPage;
