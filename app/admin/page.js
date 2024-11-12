"use client";

import { useState, useEffect } from 'react';

export default function Admin() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setProducts(products.filter((product) => product.id !== id));
    } else {
      console.error('Failed to delete product');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>관리자 대시보드</h1>
      <h2 style={styles.subHeading}>전체 상품 목록</h2>

      {products.length === 0 ? (
        <p style={styles.noProducts}>등록된 상품이 없습니다.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>상품명</th>
              <th style={styles.th}>이미지</th>
              <th style={styles.th}>가격</th>
              <th style={styles.th}>수량</th>
              <th style={styles.th}>설명</th>
              <th style={styles.th}>퍼스널 컬러</th>
              <th style={styles.th}>삭제</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={styles.td}>{product.id}</td>
                <td style={styles.td}>{product.name}</td>
                <td style={styles.td}>
                  <img src={product.image} alt={product.name} style={styles.productImage} />
                </td>
                <td style={styles.td}>{product.price.toLocaleString()}원</td>
                <td style={styles.td}>{product.quantity}개</td>
                <td style={styles.td}>{product.description}</td>
                <td style={styles.td}>{product.personalColorCategory}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={styles.deleteButton}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '24px',
    fontWeight: '500',
    marginBottom: '20px',
    color: '#666',
  },
  noProducts: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#888',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  th: {
    padding: '15px',
    backgroundColor: '#0070f3',
    color: 'white',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #ddd',
    color: '#333',
  },
  productImage: {
    width: '50px',
    borderRadius: '8px',
  },
  deleteButton: {
    backgroundColor: '#FF4D4D',
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
