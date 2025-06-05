import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalStyle from '../components/GlobalStyle';

const Profile = () => {
  const [user, setUser] = useState({ fullName: '', email: '', phone: '', address: '', role: '', status: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setUser({
      fullName: localStorage.getItem('fullName') || '',
      email: localStorage.getItem('email') || '',
      phone: localStorage.getItem('phone') || '',
      address: localStorage.getItem('address') || '',
      role: localStorage.getItem('role') || '',
      status: localStorage.getItem('status') || '',
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0ffe8 0%, #cfdef3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, marginTop: 80 }}>
      <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)', padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        {/* Avatar */}
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #2ecc40 0%, #27ae60 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: '0 2px 8px rgba(46,204,64,0.10)' }}>
          <span style={{ color: '#fff', fontSize: 44, fontWeight: 700 }}>
            {(user.fullName && user.fullName[0])
              ? user.fullName[0].toUpperCase()
              : '?'}
          </span>
        </div>
        <h2 style={{ color: '#2ecc40', margin: 0, fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>{user.fullName || 'Chưa cập nhật họ tên'}</h2>
        <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}><b>Email:</b> {user.email || 'Chưa cập nhật'}</div>
        <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}><b>SĐT:</b> {user.phone || 'Chưa cập nhật'}</div>
        <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}><b>Địa chỉ:</b> {user.address || 'Chưa cập nhật'}</div>
        <hr style={{ width: '100%', margin: '18px 0 10px 0', border: 'none', borderTop: '1.5px solid #e0e0e0' }} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button style={{ width: '100%', padding: 13, borderRadius: 10, background: 'linear-gradient(90deg, #2ecc40 0%, #27ae60 100%)', color: '#fff', fontWeight: 600, fontSize: 17, border: 'none', marginBottom: 2, cursor: 'pointer', boxShadow: '0 2px 8px rgba(46,204,64,0.10)', transition: 'background 0.2s' }} onClick={() => navigate('/edit-profile')}>Sửa thông tin cá nhân</button>
          <button style={{ width: '100%', padding: 13, borderRadius: 10, background: 'linear-gradient(90deg, #27ae60 0%, #2ecc40 100%)', color: '#fff', fontWeight: 600, fontSize: 17, border: 'none', marginBottom: 2, cursor: 'pointer', boxShadow: '0 2px 8px rgba(46,204,64,0.10)', transition: 'background 0.2s' }} onClick={() => navigate('/my-orders')}>Lịch sử order</button>
          <button style={{ width: '100%', padding: 13, borderRadius: 10, background: 'linear-gradient(90deg, #e74c3c 0%, #e67e22 100%)', color: '#fff', fontWeight: 600, fontSize: 17, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,76,60,0.10)', transition: 'background 0.2s' }} onClick={handleLogout}>Đăng xuất</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;