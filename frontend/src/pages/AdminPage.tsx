import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Title {
    show_id: string;
    type: string;
    title: string;
    director: string;
    cast: string;
    country: string;
    release_year: number;
    rating: string;
    duration: string;
    description: string;
    genres: string[];
}

const AddTitleModal: React.FC<{ show: boolean, handleClose: () => void }> = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add a New Movie/TV Show</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formTitle" style={{ paddingBottom: '10px' }}>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control  type="text" placeholder="Enter title" />
                    </Form.Group>
                    <Form.Group controlId="formDirector" style={{ paddingBottom: '10px' }}>
                        <Form.Label>Director:</Form.Label>
                        <Form.Control type="text" placeholder="Enter director" />
                    </Form.Group>
                    <Form.Group controlId="formReleaseYear" style={{ paddingBottom: '10px' }}>
                        <Form.Label>Release Year:</Form.Label>
                        <Form.Control type="number" placeholder="Enter release year" />
                    </Form.Group>
                    <Form.Group controlId="formRating" style={{ paddingBottom: '10px' }}>
                        <Form.Label>Rating:</Form.Label>
                        <Form.Control type="text" placeholder="Enter rating" />
                    </Form.Group>
                    <Form.Group controlId="formDuration" style={{ paddingBottom: '10px' }}>
                        <Form.Label>Duration:</Form.Label>
                        <Form.Control type="text" placeholder="Enter duration" />
                    </Form.Group>
                    <Form.Group controlId="formGenres" style={{ paddingBottom: '10px' }}>
                        <Form.Label>Genre:</Form.Label>
                        <Form.Control type="text" placeholder="Enter genres" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => { /* Handle form submission */ }}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export const AdminPage: React.FC = () => {
    const [titles, setTitles] = useState<Title[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchTitles();
    }, []);

    const fetchTitles = async () => {
        try {
            const response = await fetch('/api/titles');
            const data = await response.json();
            
            // Transform the data to extract genres where value is 1
            const transformedData = data.map((title: any) => {
                const genres = [];
                if (title.action === 1) genres.push('Action');
                if (title.adventure === 1) genres.push('Adventure');
                if (title.anime_series_international_tv_shows === 1) genres.push('Anime');
                if (title.british_tv_shows_docuseries_international_tv_shows === 1) genres.push('British TV');
                if (title.children === 1) genres.push('Children');
                if (title.comedies === 1) genres.push('Comedy');
                if (title.comedies_dramas_international_movies === 1) genres.push('Comedy Drama');
                if (title.comedies_international_movies === 1) genres.push('International Comedy');
                if (title.comedies_romantic_movies === 1) genres.push('Romantic Comedy');
                if (title.crime_tv_shows_docuseries === 1) genres.push('Crime');
                if (title.documentaries === 1) genres.push('Documentary');
                if (title.documentaries_international_movies === 1) genres.push('International Documentary');
                if (title.docuseries === 1) genres.push('Docuseries');
                
                return {
                    ...title,
                    genres
                };
            });
            
            setTitles(transformedData);
        } catch (error) {
            console.error('Error fetching titles:', error);
        }
    };

    const handleEdit = (showId: string) => {
        // Implement edit functionality
        console.log('Edit:', showId);
    };

    const handleDelete = async (showId: string) => {
        if (window.confirm('Are you sure you want to delete this title?')) {
            try {
                await fetch(`/api/titles/${showId}`, {
                    method: 'DELETE'
                });
                fetchTitles(); // Refresh the list
            } catch (error) {
                console.error('Error deleting title:', error);
            }
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <div>
            <Header />
            <div className="container my-4">
                <h1 className="mb-4">Movie Database Administration</h1>
                <Button variant="primary" className="mb-3" onClick={handleShowModal}>
                    Add New Title
                </Button>
                
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Show ID</th>
                            <th>Type</th>
                            <th>Title</th>
                            <th>Director</th>
                            <th>Release Year</th>
                            <th>Rating</th>
                            <th>Duration</th>
                            <th>Genres</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {titles.map((title) => (
                            <tr key={title.show_id}>
                                <td>{title.show_id}</td>
                                <td>{title.type}</td>
                                <td>{title.title}</td>
                                <td>{title.director || 'N/A'}</td>
                                <td>{title.release_year}</td>
                                <td>{title.rating || 'N/A'}</td>
                                <td>{title.duration || 'N/A'}</td>
                                <td>{title.genres.join(', ')}</td>
                                <td>
                                    <Button 
                                        variant="warning" 
                                        size="sm" 
                                        className="me-2"
                                        onClick={() => handleEdit(title.show_id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        size="sm"
                                        onClick={() => handleDelete(title.show_id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Footer />
            <AddTitleModal show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default AdminPage;
