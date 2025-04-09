import { Movie } from "../types/Movie";

interface FetchMoviesResponse {
  movies: Movie[];
  totalNumMovies: number;
}

const API_URL = "https://localhost:5000/CineNiche"; // Correct API URL

// Default fetch options for all requests
const defaultOptions = {
  credentials: "include" as RequestCredentials,
  headers: {
    "Content-Type": "application/json",
  },
};

// Fetch movies with pagination and category filtering
export const fetchMovies = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[],
  sortOrder: string | null,
  searchTerm: string = ""
): Promise<FetchMoviesResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `categories=${encodeURIComponent(cat)}`)
      .join("&");

    let url = `${API_URL}/GetMovies?pageSize=${pageSize}&pageNum=${pageNum}${
      selectedCategories.length ? `&${categoryParams}` : ""
    }`;

    if (sortOrder) {
      url += `&sortOrder=${sortOrder}`;
    }
    
    if (searchTerm.trim()) {
      url += `&search=${encodeURIComponent(searchTerm.trim())}`;
    }

    const response = await fetch(url, defaultOptions);
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json();
    return {
      movies: data.movies,
      totalNumMovies: data.totalNumMovies,
    };
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

// Add a new movie
export const addMovie = async (newMovie: Movie): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/AddMovie`, {
      ...defaultOptions,
      method: "POST",
      body: JSON.stringify(newMovie),
    });

    if (!response.ok) {
      throw new Error("Failed to add movie");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding movie", error);
    throw error;
  }
};

// Update an existing movie by its showId
export const updateMovie = async (
  showId: string,
  updatedMovie: Movie
): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/UpdateMovie/${showId}`, {
      ...defaultOptions,
      method: "PUT",
      body: JSON.stringify(updatedMovie),
    });

    if (!response.ok) {
      throw new Error("Failed to update movie");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};

// Delete a movie by its showId
export const deleteMovie = async (showId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteMovie/${showId}`, {
      ...defaultOptions,
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete movie");
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};
// Fetch a single movie by ID
export const fetchMovieById = async (movieId: string): Promise<Movie> => {
  try {
    const response = await fetch(
      `${API_URL}/GetMovie/${movieId}`,
      defaultOptions
    );
    if (!response.ok) {
      throw new Error("Failed to fetch movie");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie:", error);
    throw error;
  }
};

