import React from 'react';

const UserAvatar = ({ userId, username, size = 'md' }) => {
  return (
    <div style={{
      width: size === 'md' ? '40px' : '24px',
      height: size === 'md' ? '40px' : '24px',
      borderRadius: '50%',
      backgroundColor: '#ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px'
    }}>
      {username ? username.charAt(0).toUpperCase() : 'U'}
    </div>
  );
};

export default UserAvatar;

