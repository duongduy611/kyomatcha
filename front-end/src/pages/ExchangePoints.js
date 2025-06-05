import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExchangePoints = () => {
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    axios.get(`/api/users/${userId}/points`).then(res => setPoints(res.data.points));
  }, [navigate]);

  const handleExchange = async (exchangePoints) => {
    setLoading(true);
    setMessage('');
    const userId = localStorage.getItem('userId');
    try {
      const res = await axios.post(`/api/users/${userId}/exchange-points`, { points: exchangePoints });
      setMessage(res.data.message + (res.data.voucher ? ` (Voucher: ${res.data.voucher})` : ''));
      // Cập nhật lại điểm
      const updated = await axios.get(`/api/users/${userId}/points`);
      setPoints(updated.data.points);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0ffe8 0%, #cfdef3 100%)', paddingTop: 80 }}>
      <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)', padding: 36, marginTop: 40 }}>
        <h2 style={{ color: '#e17055', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Quy đổi điểm lấy voucher</h2>
        <div style={{ color: '#2ecc40', fontSize: 18, fontWeight: 600, marginBottom: 18 }}>
          <span>Điểm hiện tại: </span>
          <span style={{ color: '#27ae60', fontWeight: 700 }}>{points}</span>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12, fontWeight: 500 }}>Chọn mức quy đổi:</div>
          <button disabled={loading || points < 50} style={{ width: '100%', padding: 13, borderRadius: 10, background: points >= 50 ? 'linear-gradient(90deg, #fdcb6e 0%, #e17055 100%)' : '#eee', color: points >= 50 ? '#fff' : '#aaa', fontWeight: 600, fontSize: 17, border: 'none', marginBottom: 12, cursor: points >= 50 ? 'pointer' : 'not-allowed', boxShadow: '0 2px 8px rgba(253,203,110,0.10)', transition: 'background 0.2s' }} onClick={() => handleExchange(50)}>Đổi 50 điểm lấy voucher 15%</button>
          <button disabled={loading || points < 100} style={{ width: '100%', padding: 13, borderRadius: 10, background: points >= 100 ? 'linear-gradient(90deg, #e17055 0%, #fdcb6e 100%)' : '#eee', color: points >= 100 ? '#fff' : '#aaa', fontWeight: 600, fontSize: 17, border: 'none', marginBottom: 12, cursor: points >= 100 ? 'pointer' : 'not-allowed', boxShadow: '0 2px 8px rgba(231,112,85,0.10)', transition: 'background 0.2s' }} onClick={() => handleExchange(100)}>Đổi 100 điểm lấy voucher 30%</button>
        </div>
        {message && <div style={{ marginBottom: 18, color: message.includes('thành công') ? '#27ae60' : '#e74c3c', fontWeight: 600 }}>{message}</div>}
        <button style={{ marginTop: 8, padding: 12, borderRadius: 10, background: 'linear-gradient(90deg, #2ecc40 0%, #27ae60 100%)', color: '#fff', fontWeight: 600, fontSize: 17, border: 'none', cursor: 'pointer' }} onClick={() => navigate('/profile')}>Quay lại trang cá nhân</button>
      </div>
    </div>
  );
};

export default ExchangePoints;