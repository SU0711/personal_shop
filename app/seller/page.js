"use client";

import { useState } from 'react';

export default function Seller() {
  const [form, setForm] = useState({
    name: '',
    image: '',
    price: '',
    quantity: '',
    description: '',
    personalColorCategory: '', // 추가된 필드
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage('상품이 성공적으로 추가되었습니다!');
        setForm({
          name: '',
          image: '',
          price: '',
          quantity: '',
          description: '',
          personalColorCategory: '', // 초기화
        });
      } else {
        setMessage('상품 추가 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('상품 추가 실패:', error);
      setMessage('상품 추가에 실패했습니다.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>상품 등록</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>상품 이름:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>이미지 URL:</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>가격:</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>수량:</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>상품 설명:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            style={{ ...styles.input, height: '100px' }}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>퍼스널 컬러 카테고리:</label>
          <select
            name="personalColorCategory"
            value={form.personalColorCategory}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">카테고리 선택</option>
            <option value="봄웜톤">봄 웜톤</option>
            <option value="여름쿨톤">여름 쿨톤</option>
            <option value="가을웜톤">가을 웜톤</option>
            <option value="겨울쿨톤">겨울 쿨톤</option>
          </select>
        </div>
        <button type="submit" style={styles.button}>상품 등록</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    marginBottom: '8px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    width: '100%',
  },
  select: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    width: '100%',
  },
  button: {
    padding: '15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '16px',
    color: '#333',
  },
};
