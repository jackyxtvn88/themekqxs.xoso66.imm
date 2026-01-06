import React from 'react';
import styles from '../styles/tableDateKQXS.module.css';

export default function TableDate({ data = [], selectedDate }) {
  return (
    <div className={styles.tableDateContainer || 'table-date-container'}>
      <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
        📅 Kết Quả {selectedDate ? selectedDate.toLocaleDateString('vi-VN') : 'Hôm nay'}
      </h3>
      <div style={{
        overflowX: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: 'bold' }}>Loại Giải</th>
              <th style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Kết Quả</th>
              <th style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Thường Xuyên</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{item.type || `Giải ${idx + 1}`}</td>
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#ff6b6b' }}>
                    {item.result || '-'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#666' }}>
                    {item.frequency || '0'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Chưa có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

