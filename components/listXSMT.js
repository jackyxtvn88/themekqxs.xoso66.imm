import React from 'react';
import styles from '../styles/listXSMT.module.css';

export default function ListXSMT({ data = [] }) {
  return (
    <div className={styles.listXsMtContainer || 'list-xs-mt-container'}>
      <h3 style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>📋 Kết Quả XSMN</h3>
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        {data && data.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} style={{
                  borderBottom: '1px solid #eee',
                  padding: '10px'
                }}>
                  <td style={{ padding: '8px', fontSize: '12px' }}>{item.name || `Kết quả ${idx + 1}`}</td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#ff6b6b', fontSize: '12px' }}>
                    {item.value || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
            Chưa có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
}

