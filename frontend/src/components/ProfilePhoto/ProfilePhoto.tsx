import React from 'react';
import './ProfilePhoto.css';

/**
 * We have 6 images total (indices 0–5):
 * 0: default (some fallback icon or default avatar)
 * 1: green
 * 2: pink
 * 3: blue
 * 4: purple
 * 5: white
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
  pictureId: number;      // which picture to show
  size?: number;          // optional size override (defaults to 180)
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  pictureId,
  size = 180
}) => {
  // gracefully handle out-of-range indices by defaulting to 0
  const src = profileImagePaths[pictureId] || profileImagePaths[0];

  return (
    <img
      src={src}
      alt="User Profile"
      className="profile-photo"
      style={{
        width: size,
        height: size
      }}
    />
  );
};

export default ProfilePhoto;
