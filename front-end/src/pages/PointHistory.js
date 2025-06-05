import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PointHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    axios.get(`/api/users/${userId}/point-history`)
      .then(res => setHistory(res.data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0ffe8 0%, #cfdef3 100%)', paddingTop: 80 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)', padding: 36, marginTop: 40 }}>
        <h2 style={{ color: '#2ecc40', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Lịch sử tích điểm</h2>
        {loading ? <div>Đang tải...</div> : (
          history.length === 0 ? <div>Bạn chưa có lịch sử tích điểm.</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#e0ffe8' }}>
                  <th style={{ padding: 10, borderRadius: 8 }}>Mã đơn</th>
                  <th style={{ padding: 10, borderRadius: 8 }}>Tổng tiền</th>
                  <th style={{ padding: 10, borderRadius: 8 }}>Điểm nhận</th>
                  <th style={{ padding: 10, borderRadius: 8 }}>Ngày nhận</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.orderId} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: 10 }}>{item.orderId}</td>
                    <td style={{ padding: 10 }}>{item.total.toLocaleString()}đ</td>
                    <td style={{ padding: 10, color: '#27ae60', fontWeight: 600 }}>{item.points}</td>
                    <td style={{ padding: 10 }}>{new Date(item.createdAt).toLocaleString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
        <button style={{ marginTop: 24, padding: 12, borderRadius: 10, background: 'linear-gradient(90deg, #2ecc40 0%, #27ae60 100%)', color: '#fff', fontWeight: 600, fontSize: 17, border: 'none', cursor: 'pointer' }} onClick={() => navigate('/profile')}>Quay lại trang cá nhân</button>
      </div>
    </div>
  );
};

export default PointHistory;