import React from 'react';
import styles from '../styles/listXSMN.module.css';

export default function ListXSMN({ data = [] }) {
  return (
    <div className={styles.listXsMnContainer || 'list-xs-mn-container'}>
      <h3 style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>🏆 Kết Quả XSMN</h3>
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        {data && data.length > 0 ? (
          <div style={{ padding: '10px' }}>
            {data.map((item, idx) => (
              <div key={idx} style={{
                padding: '8px',
                borderBottom: idx < data.length - 1 ? '1px solid #eee' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}>
                <span>{item.name || `Kết quả ${idx + 1}`}</span>
                <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>{item.value || '-'}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
            Chưa có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
}

