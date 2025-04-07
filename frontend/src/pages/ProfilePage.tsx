import './ProfilePage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';


const ProfilePage = () => {
  return (
    <>
    <Header />
    <div className="profile-container">
      <h1>My Profile</h1>
      <div className="profile-details">
        <div className="profile-field">
          <label>First Name</label>
          <input type="text" disabled value="John" />
        </div>
        <div className="profile-field">
          <label>Last Name</label>
          <input type="text" disabled value="Doe" />
        </div>
        <div className="profile-field">
          <label>Email</label>
          <input type="email" disabled value="john.doe@example.com" />
        </div>
        <div className="profile-photo-section">
          <img src="path/to/profile-photo.jpg" alt="Profile" className="profile-photo" />
          <button className="edit-photo-button">Edit</button>
        </div>
        <button className="profile-button">Edit</button>
        <button className="profile-button">Log Out</button>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ProfilePage;
