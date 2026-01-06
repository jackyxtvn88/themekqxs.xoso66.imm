import React from 'react';

const UserAvatar = ({ userId, username, size = 'md', avatar }) => {
  const sizeMap = {
    sm: { width: '24px', height: '24px', fontSize: '10px' },
    md: { width: '40px', height: '40px', fontSize: '16px' },
    lg: { width: '56px', height: '56px', fontSize: '20px' },
  };

  const sizeStyle = sizeMap[size] || sizeMap.md;

  return (
    <div style={{
      ...sizeStyle,
      borderRadius: '50%',
      backgroundColor: avatar || '#ccc',
      backgroundImage: avatar ? `url(${avatar})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: sizeStyle.fontSize,
      fontWeight: 'bold',
      color: 'white',
      overflow: 'hidden',
      border: '2px solid #f5f5f5',
      flexShrink: 0
    }} title={username}>
      {!avatar && username ? username.charAt(0).toUpperCase() : ''}
    </div>
  );
};

export default UserAvatar;

