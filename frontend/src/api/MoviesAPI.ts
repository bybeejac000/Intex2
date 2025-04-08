import { Movie } from "../types/Movie";

interface FetchMovieResponse {
    movies: Movie[];
    totalNumMovies: number;
}

export const API_URL = 'needURLhere';

export const fetchMovies = async (
    pageSize: number,
    pageNum: number,
    
): Promise<FetchMovieResponse> => {
    try{

    const response = await fetch(
        `${API_URL}/AllMovies?pageSize=${pageSize}&pageNum=${pageNum}}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    return await response.json();
    } 
    catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
    }
};

export const addMovie = async (newMovie: Movie): Promise<Movie> => {
    try {
        const response = await fetch(`${API_URL}/AddMovie`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
        },
        body: 
        JSON.stringify(newMovie)
        });

        if (!response.ok) {
            throw new Error('Failed to add movie');
        }
        return await response.json();
        } catch (error) {
            console.error('Error adding movie', error);
            throw error;
        }   
    
};

export const updateMovie = async (movieId: number, movieBook: Movie) : Promise<Movie> => {
    try {
        const response = await fetch(`${API_URL}/UpdateMovie/${movieId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',},
            body: JSON.stringify(movieBook)
    }); 
    return await response.json(); }
    
    catch (error) {
        console.error("error updating movie:", error);
        throw error;
    }
};

export const deleteMovie = async (movieId: number): Promise<void>=> {
    try {
        const response = await fetch(`${API_URL}/DeleteMovie/${movieId}`,
            {
                method: 'DELETE'
            }
        );

        if (!response.ok) {
            throw new Error('Failed to delete movie');
        }
    } catch (error) {
        console.error('Error deleting movie:', error);
        throw error;
    }
}