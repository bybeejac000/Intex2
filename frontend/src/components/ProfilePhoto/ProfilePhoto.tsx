import React from 'react';
import './ProfilePhoto.css';

/**
 * We have 6 images (indices 0–5):
 * 0: default, 1: green, 2: pink, 3: blue, 4: purple, 5: white.
 */
const profileImagePaths = [
  '/images/profile_pictures/default.png', // 0
  '/images/profile_pictures/green.png',   // 1
  '/images/profile_pictures/pink.png',    // 2
  '/images/profile_pictures/blue.png',    // 3
  '/images/profile_pictures/purple.png',  // 4
  '/images/profile_pictures/white.png'    // 5
];

interface ProfilePhotoProps {
  pictureId: number;
  size?: number;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ pictureId, size = 180 }) => {
  const src = profileImagePaths[pictureId] || profileImagePaths[0];
  return (
    <img
      src={src}
      alt="User Profile"
      className="profile-photo"
      style={{ width: size, height: size }}
    />
  );
};

export default ProfilePhoto;
