import { useEffect, useState } from "react";
import { Movie } from "../types/Movie";
import { deleteMovie, fetchMovies } from "../api/MoviesAPI";
import NewMovieForm from "../components/NewMovieForm";
import EditMovieForm from "../components/EditMovieForm";
import Pagination from "../components/Pagination";
import { Modal } from "bootstrap";

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  //const [showForm, setShowForm] = useState(false);
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
    <div className="container-fluid min-vh-100" style={{ backgroundColor: '#F0F2F5' }}>
      <div className="d-flex justify-content-center align-items-center pt-5">
        <button 
          className="btn btn-link text-dark text-decoration-none me-3" 
          onClick={() => window.history.back()}
          style={{ fontSize: '1.5rem' }}
        >
          ←
        </button>
        <h1 className="mb-0">Administrator Database</h1>
      </div>

      <div className="text-center">
        <h5 className="mt-3 mb-5">
          Collection of all titles available on CineNiche with their respective information and reviews.
        </h5>
      </div>
      <button
        className="btn btn-success"
        data-bs-toggle="modal"
        data-bs-target="#addMovieModal"
      >Add a Title</button>
      <br />
      <br />
      {/* Space before table */}
      <br />
      <br />

      <div className="row">
        {/* Left Column - Filters */}
        <div className="col-md-3">
          <div className="card shadow" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
            <div className="card-body">
              <h3 className="card-title h5 mb-3">Sort Options</h3>
              <div className="d-grid gap-2 mb-4">
                <button className="btn btn-outline-primary" onClick={() => setSortOrder(null)}>Default Order</button>
                <button className="btn btn-outline-primary" onClick={() => setSortOrder("asc")}>Sort A → Z</button>
                <button className="btn btn-outline-primary" onClick={() => setSortOrder("desc")}>Sort Z → A</button>
              </div>

              <h3 className="card-title h5 mb-3">Filter by Categories</h3>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="actionCheck"
                  checked={selectedCategories.includes("action")}
                  onChange={() =>
                    setSelectedCategories((prevCategories) =>
                      prevCategories.includes("action")
                        ? prevCategories.filter((cat) => cat !== "action")
                        : [...prevCategories, "action"]
                    )
                  }
                />
                <label className="form-check-label" htmlFor="actionCheck">
                  Action
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="comedyCheck"
                  checked={selectedCategories.includes("comedy")}
                  onChange={() =>
                    setSelectedCategories((prevCategories) =>
                      prevCategories.includes("comedy")
                        ? prevCategories.filter((cat) => cat !== "comedy")
                        : [...prevCategories, "comedy"]
                    )
                  }
                />

                <label className="form-check-label" htmlFor="comedyCheck">
                  Comedy
                </label>
              </div>

              <div className="mt-4">
                <label className="form-label">Results per page:</label>
                <select 
                  className="form-select"
                  value={pageSize} 
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageNum(1);
                  }}
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Movie List */}
        <div className="col-md-9">
          {movies.map((m) => (
            <div key={m.show_id} className="card mb-3 shadow" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h5 className="card-title mb-1">{m.title}</h5>
                    <div className="text-muted small">
                      {m.release_year} • {m.duration}
                    </div>
                  </div>
                  <div className="col-md-6 text-md-end mt-3 mt-md-0">
                    <button
                      className="btn btn-outline-info btn-sm me-2"
                      data-bs-toggle="modal"
                      data-bs-target={`#infoModal${m.show_id}`}
                    >
                      All Information
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => setEditingMovie(m)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(m.show_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <Pagination
              currentPage={pageNum}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPageNum}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      </div>

      {/* Add Movie Modal */}
      <div className="modal fade" id="addMovieModal" tabIndex={-1} aria-labelledby="addMovieModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="modal-header">
              <h5 className="modal-title" id="addMovieModalLabel">Add New Movie</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <NewMovieForm
                onSuccess={() => {
                  const modalElement = document.getElementById('addMovieModal');
                  if (modalElement) {
                    const modal = Modal.getInstance(modalElement);
                    modal?.hide();
                  }
                  fetchMovies(pageSize, pageNum, selectedCategories, sortOrder).then(
                    (data) => setMovies(data.movies)
                  );
                }}
                onCancel={() => {
                  const modalElement = document.getElementById('addMovieModal');
                  if (modalElement) {
                    const modal = Modal.getInstance(modalElement);
                    modal?.hide();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Modals */}
      {movies.map((m) => (
        <div key={`modal-${m.show_id}`} className="modal fade" id={`infoModal${m.show_id}`} tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="modal-header">
                <h5 className="modal-title">{m.title}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p><strong>Show ID:</strong> {m.show_id}</p>
                <p><strong>Director:</strong> {m.director}</p>
                <p><strong>Cast:</strong> {m.cast}</p>
                <p><strong>Country:</strong> {m.country}</p>
                <p><strong>Release Year:</strong> {m.release_year}</p>
                <p><strong>Rating:</strong> {m.rating}</p>
                <p><strong>Duration:</strong> {m.duration}</p>
                <p><strong>Description:</strong> {m.description}</p>
                <div><strong>Genre{"(s)"}:</strong>
                  <ul className="list-unstyled mb-0">
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
                          <li key={key} className="badge bg-secondary me-1 mb-1">{key}</li>
                        ) : null;
                      }
                      return null;
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

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
    </div>
  );
};

export default AdminMoviesPage;
