import React from 'react';
import styles from '../styles/congcuHot.module.css';

export default function CongCuHot() {
  const tools = [
    { name: 'Soi Cầu', icon: '🔮', href: '/soicau' },
    { name: 'Tạo Dàn', icon: '🎲', href: '/tao-dan-de-dac-biet' },
    { name: 'Thống Kê', icon: '📊', href: '/thongke/giai-dac-biet' },
    { name: 'Lô Gan', icon: '🎯', href: '/thongke/lo-gan' },
  ];

  return (
    <div className={styles.congCuHotContainer || 'congcu-hot-container'}>
      <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>🔥 Công Cụ Hot</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '10px'
      }}>
        {tools.map((tool, idx) => (
          <a
            key={idx}
            href={tool.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '15px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffc107';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fff3cd';
              e.target.style.color = '#333';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '24px', marginBottom: '5px' }}>{tool.icon}</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>{tool.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

