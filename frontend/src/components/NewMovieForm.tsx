// src/components/NewMovieForm.tsx
import React, { useState } from "react";
import { Movie } from "../types/Movie";
import { addMovie } from "../api/MoviesAPI";

interface NewMovieFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMovieForm = ({ onSuccess, onCancel }: NewMovieFormProps) => {
  const [formData, setFormData] = useState<Movie>({
    show_id: "",
    type: "",
    title: "",
    director: "",
    cast: "",
    country: "",
    release_year: 0,
    rating: "",
    duration: "",
    description: "",
    action: 0,
    adventure: 0,
    anime_series_international_tv_shows: 0,
    british_tv_shows_docuseries_international_tv_shows: 0,
    children: 0,
    comedies: 0,
    comedies_dramas_international_movies: 0,
    comedies_international_movies: 0,
    comedies_romantic_movies: 0,
    crime_tv_shows_docuseries: 0,
    documentaries: 0,
    documentaries_international_movies: 0,
    docuseries: 0,
    dramas: 0,
    dramas_international_movies: 0,
    dramas_romantic_movies: 0,
    family_movies: 0,
    fantasy: 0,
    horror_movies: 0,
    international_movies_thrillers: 0,
    international_tv_shows_romantic_tv_shows_tv_dramas: 0,
    kids_tv: 0,
    language_tv_shows: 0,
    musicals: 0,
    nature_tv: 0,
    reality_tv: 0,
    spirituality: 0,
    tv_action: 0,
    tv_comedies: 0,
    tv_dramas: 0,
    talk_shows_tv_comedies: 0,
    thrillers: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("formData", formData);

    // Optional auto-generated ID
    if (!formData.show_id) {
      formData.show_id = `s${Date.now()}`; // e.g., s1712512219982
    }
    console.log(formData.show_id);

    await addMovie(formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
      <h2 style={{ color: '#00294D', marginBottom: '2rem' }}>Add New Title</h2>

      <div className="row g-3">
        {/* Basic Information */}
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" style={{ color: '#00294D', fontWeight: '500' }}>Type</label>
            <select 
              className="form-select" 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              style={{ backgroundColor: '#FFFFFF', border: 'none' }}
            >
              <option value="">Select Type</option>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#00294D', fontWeight: '500' }}>Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{ backgroundColor: '#FFFFFF', border: 'none' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#00294D', fontWeight: '500' }}>Director</label>
            <input
              type="text"
              className="form-control"
              name="director"
              value={formData.director}
              onChange={handleChange}
              style={{ backgroundColor: '#FFFFFF', border: 'none' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#00294D', fontWeight: '500' }}>Cast</label>
            <input
              type="text"
              className="form-control"
              name="cast"
              value={formData.cast}
              onChange={handleChange}
              style={{ backgroundColor: '#FFFFFF', border: 'none' }}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label" style={{ color: '#00294D', fontWeight: '500' }}>Country</label>
            <input
              type="text"
              className="form-control"
              name="country"
              value={formData.country}
              onChange={handleChange}
              style={{ backgroundColor: '#FFFFFF', border: 'none' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#00294D', fontWeight: '500' }}>Release Year</label>
            <input
              type="number"
              className="form-control"
              name="release_year"
              value={formData.release_year || ''}
              onChange={handleChange}
              style={{ backgroundColor: '#FFFFFF', border: 'none' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#00294D', fontWeight: '500' }}>Rating</label>
            <input
              type="text"
              className="form-control"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              style={{ backgroundColor: '#FFFFFF', border: 'none' }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#00294D', fontWeight: '500' }}>Duration (minutes)</label>
            <input
              type="text"
              className="form-control"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              style={{ backgroundColor: '#FFFFFF', border: 'none' }}
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label" style={{ color: '#00294D', fontWeight: '500' }}>Description</label>
        <textarea
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          style={{ backgroundColor: '#FFFFFF', border: 'none' }}
        />
      </div>

      {/* Categories */}
      <div className="mb-4">
        <h3 style={{ color: '#00294D', marginBottom: '1rem' }}>Categories</h3>
        <div className="row g-2">
          {Object.keys(formData)
            .filter(key => 
              key !== "show_id" &&
              key !== "title" &&
              key !== "director" &&
              key !== "cast" &&
              key !== "country" &&
              key !== "release_year" &&
              key !== "rating" &&
              key !== "duration" &&
              key !== "description" &&
              key !== "type"
            )
            .map((key) => (
              <div key={key} className="col-md-3 col-sm-4 col-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name={key}
                    id={key}
                    checked={formData[key as keyof Movie] === 1}
                    onChange={handleChange}
                    style={{ borderColor: '#1976d2' }}
                  />
                  <label 
                    className="form-check-label" 
                    htmlFor={key}
                    style={{ color: '#00294D', fontWeight: '500', textAlign: 'left', paddingLeft: '10px', paddingTop: '2px' }}
                  >
                    {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button 
          type="button" 
          className="btn" 
          onClick={onCancel}
          style={{ 
            backgroundColor: '#FFFFFF', 
            color: '#00294D',
            border: '1px solid #FFFFFF'
          }}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn"
          style={{ 
            backgroundColor: '#1976d2', 
            color: 'white',
            border: 'none'
          }}
        >
          Add Movie
        </button>
      </div>
    </form>
  );
};

export default NewMovieForm;
