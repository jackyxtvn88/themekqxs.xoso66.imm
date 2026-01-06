import React from 'react';

const EditPostModal = ({ isOpen, onClose, post, onSave }) => {
  if (!isOpen) return null;
  return (
    <div style={{ display: 'none' }}>
      <h2>Edit Post</h2>
    </div>
  );
};

export default EditPostModal;

