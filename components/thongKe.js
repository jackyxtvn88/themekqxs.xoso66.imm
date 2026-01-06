import React from 'react';
import styles from '../styles/tansuatLoto.module.css';

export default function ThongKe({ data = [] }) {
  return (
    <div className={styles.thongKeContainer || 'thongKe-container'}>
      <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>📊 Thống Kê</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px'
      }}>
        {data && data.length > 0 ? (
          data.map((item, idx) => (
            <div key={idx} style={{
              border: '1px solid #ddd',
              padding: '10px',
              borderRadius: '4px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ fontSize: '12px', color: '#666' }}>{item.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff6b6b' }}>{item.value}</div>
            </div>
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Chưa có dữ liệu</div>
        )}
      </div>
    </div>
  );
}

