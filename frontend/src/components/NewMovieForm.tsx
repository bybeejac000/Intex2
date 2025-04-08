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
    <form onSubmit={handleSubmit}>
      <h2>Add New Movie</h2>

      {/* <label>
        Show ID:
        <input
          type="text"
          name="show_id"
          value={formData.show_id}
          onChange={handleChange}
          required
        />
      </label> */}

      <label>
        Type:
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="">Select Type</option>
          <option value="Movie">Movie</option>
          <option value="TV Show">TV Show</option>
        </select>
      </label>
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </label>
      <label>
        Director:
        <input
          type="text"
          name="director"
          value={formData.director}
          onChange={handleChange}
        />
      </label>
      <label>
        Cast:
        <input
          type="text"
          name="cast"
          value={formData.cast}
          onChange={handleChange}
        />
      </label>
      <label>
        Country:
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
      </label>
      <label>
        Release Year:
        <input
          type="number"
          name="release_year"
          value={formData.release_year}
          onChange={handleChange}
        />
      </label>
      <label>
        Rating:
        <input
          type="text"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        />
      </label>
      <label>
        Duration (minutes):
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>

      {/* Categories */}
      <div className="categories">
        {Object.keys(formData).map((key) => {
          if (
            key !== "show_id" &&
            key !== "title" &&
            key !== "director" &&
            key !== "cast" &&
            key !== "country" &&
            key !== "release_year" &&
            key !== "rating" &&
            key !== "duration" &&
            key !== "description"
          ) {
            return (
              <label key={key}>
                <input
                  type="checkbox"
                  name={key}
                  checked={formData[key as keyof Movie] === 1}
                  onChange={handleChange}
                />
                {key.replace(/_/g, " ").toUpperCase()}
              </label>
            );
          }
          return null;
        })}
      </div>

      <button type="submit">Add Movie</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default NewMovieForm;
