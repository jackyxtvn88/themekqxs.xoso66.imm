import React from 'react';
import styles from '../styles/listpost.module.css';

export default function ListPost({ posts = [] }) {
  return (
    <div className={styles.listPostContainer || 'list-post-container'}>
      <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>📰 Bài Viết Mới</h3>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {posts && posts.length > 0 ? (
          posts.map((post, idx) => (
            <a
              key={idx}
              href={post.link || '#'}
              style={{
                display: 'block',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                textDecoration: 'none',
                color: '#333',
                transition: 'all 0.3s',
                backgroundColor: '#f9f9f9'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.borderColor = '#ff6b6b';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9f9f9';
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>
                {post.title || `Bài viết ${idx + 1}`}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                {post.excerpt || post.content?.substring(0, 60) + '...'}
              </div>
              <div style={{ fontSize: '11px', color: '#999' }}>
                📅 {post.date || new Date().toLocaleDateString('vi-VN')}
              </div>
            </a>
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
            Chưa có bài viết nào
          </div>
        )}
      </div>
    </div>
  );
}
