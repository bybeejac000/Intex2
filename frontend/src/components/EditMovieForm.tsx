import { useState } from "react";
import { Movie } from "../types/Movie";
import { updateMovie } from "../api/MoviesAPI";

interface EditMovieFormProps {
  movie: Movie;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditMovieForm = ({ movie, onSuccess, onCancel }: EditMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({ ...movie });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked ? 1 : 0, // Handle checkbox logic
      });
    } else {
      setFormData({
        ...formData,
        [name]: value, // Handle other input types
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMovie(formData.show_id, formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-3">
        <label htmlFor="title" className="form-label" style={{ color: '#00294D' }}>Title</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          style={{ backgroundColor: '#FFFFFF', borderColor: '#00294D' }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="director" className="form-label" style={{ color: '#00294D' }}>Director</label>
        <input
          type="text"
          className="form-control"
          id="director"
          value={formData.director}
          onChange={(e) => setFormData({ ...formData, director: e.target.value })}
          required
          style={{ backgroundColor: '#FFFFFF', borderColor: '#00294D' }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="cast" className="form-label" style={{ color: '#00294D' }}>Cast</label>
        <input
          type="text"
          className="form-control"
          id="cast"
          value={formData.cast}
          onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
          required
          style={{ backgroundColor: '#FFFFFF', borderColor: '#00294D' }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="country" className="form-label" style={{ color: '#00294D' }}>Country</label>
        <input
          type="text"
          className="form-control"
          id="country"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          required
          style={{ backgroundColor: '#FFFFFF', borderColor: '#00294D' }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="release_year" className="form-label" style={{ color: '#00294D' }}>Release Year</label>
        <input
          type="number"
          className="form-control"
          id="release_year"
          value={formData.release_year}
          onChange={(e) => setFormData({ ...formData, release_year: parseInt(e.target.value) })}
          required
          style={{ backgroundColor: '#FFFFFF', borderColor: '#00294D' }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="rating" className="form-label" style={{ color: '#00294D' }}>Rating</label>
        <input
          type="text"
          className="form-control"
          id="rating"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          required
          style={{ backgroundColor: '#FFFFFF', borderColor: '#00294D' }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="duration" className="form-label" style={{ color: '#00294D' }}>Duration</label>
        <input
          type="text"
          className="form-control"
          id="duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          required
          style={{ backgroundColor: '#FFFFFF', borderColor: '#00294D' }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label" style={{ color: '#00294D' }}>Description</label>
        <textarea
          className="form-control"
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          style={{ backgroundColor: '#FFFFFF', borderColor: '#00294D' }}
        />
      </div>

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onCancel}
          style={{ backgroundColor: '#6c757d', borderColor: '#6c757d' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ backgroundColor: '#1976d2', borderColor: '#1976d2' }}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditMovieForm;
