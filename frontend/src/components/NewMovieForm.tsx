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
      <div className="mb-4" style={{ textAlign: 'left' }}>
        <h3 style={{ color: '#00294D', marginBottom: '1rem', textAlign: 'center' }}>Categories</h3>
        <div className="row g-2">
          {/* Action & Adventure */}
          <div className="col-md-4">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="actionAdventureCheck"
                checked={formData.action === 1 || formData.adventure === 1 || formData.tv_action === 1}
                onChange={() => {
                  const newValue = !(formData.action === 1 && formData.adventure === 1 && formData.tv_action === 1) ? 1 : 0;
                  setFormData({
                    ...formData,
                    action: newValue,
                    adventure: newValue,
                    tv_action: newValue
                  });
                }}
              />
              <label className="form-check-label" htmlFor="actionAdventureCheck">
                Action & Adventure
              </label>
            </div>
          </div>

          {/* Comedy */}
          <div className="col-md-4" style={{ textAlign: 'left' }}>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="comedyCheck"
                checked={formData.comedies === 1 || formData.comedies_romantic_movies === 1 || 
                        formData.tv_comedies === 1 || formData.talk_shows_tv_comedies === 1 ||
                        formData.comedies_international_movies === 1 || formData.comedies_dramas_international_movies === 1}
                onChange={() => {
                  const newValue = !(formData.comedies === 1 && formData.comedies_romantic_movies === 1 && 
                                    formData.tv_comedies === 1 && formData.talk_shows_tv_comedies === 1 &&
                                    formData.comedies_international_movies === 1 && formData.comedies_dramas_international_movies === 1) ? 1 : 0;
                  setFormData({
                    ...formData,
                    comedies: newValue,
                    comedies_romantic_movies: newValue,
                    tv_comedies: newValue,
                    talk_shows_tv_comedies: newValue,
                    comedies_international_movies: newValue,
                    comedies_dramas_international_movies: newValue
                  });
                }}
              />
              <label className="form-check-label" htmlFor="comedyCheck">
                Comedy
              </label>
            </div>
          </div>

          {/* Drama */}
          <div className="col-md-4">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="dramaCheck"
                checked={formData.dramas === 1 || formData.dramas_romantic_movies === 1 || 
                        formData.tv_dramas === 1 || formData.dramas_international_movies === 1 ||
                        formData.comedies_dramas_international_movies === 1 || 
                        formData.international_tv_shows_romantic_tv_shows_tv_dramas === 1}
                onChange={() => {
                  const newValue = !(formData.dramas === 1 && formData.dramas_romantic_movies === 1 && 
                                    formData.tv_dramas === 1 && formData.dramas_international_movies === 1 &&
                                    formData.comedies_dramas_international_movies === 1 && 
                                    formData.international_tv_shows_romantic_tv_shows_tv_dramas === 1) ? 1 : 0;
                  setFormData({
                    ...formData,
                    dramas: newValue,
                    dramas_romantic_movies: newValue,
                    tv_dramas: newValue,
                    dramas_international_movies: newValue,
                    comedies_dramas_international_movies: newValue,
                    international_tv_shows_romantic_tv_shows_tv_dramas: newValue
                  });
                }}
              />
              <label className="form-check-label" htmlFor="dramaCheck">
                Drama
              </label>
            </div>
          </div>

          {/* Documentaries */}
          <div className="col-md-4">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="documentaryCheck"
                checked={formData.documentaries === 1 || formData.documentaries_international_movies === 1 || 
                        formData.docuseries === 1 || formData.crime_tv_shows_docuseries === 1 ||
                        formData.british_tv_shows_docuseries_international_tv_shows === 1}
                onChange={() => {
                  const newValue = !(formData.documentaries === 1 && formData.documentaries_international_movies === 1 && 
                                    formData.docuseries === 1 && formData.crime_tv_shows_docuseries === 1 &&
                                    formData.british_tv_shows_docuseries_international_tv_shows === 1) ? 1 : 0;
                  setFormData({
                    ...formData,
                    documentaries: newValue,
                    documentaries_international_movies: newValue,
                    docuseries: newValue,
                    crime_tv_shows_docuseries: newValue,
                    british_tv_shows_docuseries_international_tv_shows: newValue
                  });
                }}
              />
              <label className="form-check-label" htmlFor="documentaryCheck">
                Documentaries
              </label>
            </div>
          </div>

          {/* Kids & Family */}
          <div className="col-md-4">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="familyCheck"
                checked={formData.children === 1 || formData.family_movies === 1 || 
                        formData.kids_tv === 1}
                onChange={() => {
                  const newValue = !(formData.children === 1 && formData.family_movies === 1 && 
                                    formData.kids_tv === 1) ? 1 : 0;
                  setFormData({
                    ...formData,
                    children: newValue,
                    family_movies: newValue,
                    kids_tv: newValue
                  });
                }}
              />
              <label className="form-check-label" htmlFor="familyCheck">
                Kids & Family
              </label>
            </div>
          </div>

          {/* Thriller & Horror */}
          <div className="col-md-4">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="thrillerCheck"
                checked={formData.thrillers === 1 || formData.horror_movies === 1 || 
                        formData.international_movies_thrillers === 1}
                onChange={() => {
                  const newValue = !(formData.thrillers === 1 && formData.horror_movies === 1 && 
                                    formData.international_movies_thrillers === 1) ? 1 : 0;
                  setFormData({
                    ...formData,
                    thrillers: newValue,
                    horror_movies: newValue,
                    international_movies_thrillers: newValue
                  });
                }}
              />
              <label className="form-check-label" htmlFor="thrillerCheck">
                Thriller & Horror
              </label>
            </div>
          </div>

          {/* International */}
          <div className="col-md-4">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="internationalCheck"
                checked={formData.international_movies_thrillers === 1 || 
                        formData.comedies_international_movies === 1 || 
                        formData.dramas_international_movies === 1 || 
                        formData.documentaries_international_movies === 1 ||
                        formData.anime_series_international_tv_shows === 1 ||
                        formData.british_tv_shows_docuseries_international_tv_shows === 1 ||
                        formData.international_tv_shows_romantic_tv_shows_tv_dramas === 1 ||
                        formData.language_tv_shows === 1}
                onChange={() => {
                  const newValue = !(formData.international_movies_thrillers === 1 && 
                                    formData.comedies_international_movies === 1 && 
                                    formData.dramas_international_movies === 1 && 
                                    formData.documentaries_international_movies === 1 &&
                                    formData.anime_series_international_tv_shows === 1 &&
                                    formData.british_tv_shows_docuseries_international_tv_shows === 1 &&
                                    formData.international_tv_shows_romantic_tv_shows_tv_dramas === 1 &&
                                    formData.language_tv_shows === 1) ? 1 : 0;
                  setFormData({
                    ...formData,
                    international_movies_thrillers: newValue,
                    comedies_international_movies: newValue,
                    dramas_international_movies: newValue,
                    documentaries_international_movies: newValue,
                    anime_series_international_tv_shows: newValue,
                    british_tv_shows_docuseries_international_tv_shows: newValue,
                    international_tv_shows_romantic_tv_shows_tv_dramas: newValue,
                    language_tv_shows: newValue
                  });
                }}
              />
              <label className="form-check-label" htmlFor="internationalCheck">
                International
              </label>
            </div>
          </div>

          {/* Other categories */}
          <div className="col-md-4">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="fantasyCheck"
                checked={formData.fantasy === 1}
                onChange={() => {
                  setFormData({
                    ...formData,
                    fantasy: formData.fantasy === 0 ? 1 : 0
                  });
                }}
              />
              <label className="form-check-label" htmlFor="fantasyCheck">
                Fantasy
              </label>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="musicalsCheck"
                checked={formData.musicals === 1}
                onChange={() => {
                  setFormData({
                    ...formData,
                    musicals: formData.musicals === 0 ? 1 : 0
                  });
                }}
              />
              <label className="form-check-label" htmlFor="musicalsCheck">
                Musicals
              </label>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="natureCheck"
                checked={formData.nature_tv === 1}
                onChange={() => {
                  setFormData({
                    ...formData,
                    nature_tv: formData.nature_tv === 0 ? 1 : 0
                  });
                }}
              />
              <label className="form-check-label" htmlFor="natureCheck">
                Nature TV
              </label>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="realityCheck"
                checked={formData.reality_tv === 1}
                onChange={() => {
                  setFormData({
                    ...formData,
                    reality_tv: formData.reality_tv === 0 ? 1 : 0
                  });
                }}
              />
              <label className="form-check-label" htmlFor="realityCheck">
                Reality TV
              </label>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="spiritualityCheck"
                checked={formData.spirituality === 1}
                onChange={() => {
                  setFormData({
                    ...formData,
                    spirituality: formData.spirituality === 0 ? 1 : 0
                  });
                }}
              />
              <label className="form-check-label" htmlFor="spiritualityCheck">
                Spirituality
              </label>
            </div>
          </div>
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
