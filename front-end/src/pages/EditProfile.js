import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GlobalStyle from '../components/GlobalStyle';

function EditProfile() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [messageProfile, setMessageProfile] = useState('');
  const [messagePassword, setMessagePassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setFullName(localStorage.getItem('fullName') || '');
    setPhone(localStorage.getItem('phone') || '');
    setAddress(localStorage.getItem('address') || '');
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessageProfile('');
    try {
      const res = await fetch('http://localhost:9999/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ fullName, phone, address }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('phone', phone);
        localStorage.setItem('address', address);
        setMessageProfile('Cập nhật thông tin thành công!');
        setTimeout(() => navigate('/profile'), 1000);
      } else {
        setMessageProfile(data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      setMessageProfile('Lỗi kết nối server');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessagePassword('');
    if (newPassword !== confirmPassword) {
      setMessagePassword('Mật khẩu mới không khớp!');
      return;
    }
    try {
      const res = await fetch('http://localhost:9999/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessagePassword('Đổi mật khẩu thành công!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/profile'), 1000);
      } else {
        setMessagePassword(data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (err) {
      setMessagePassword('Lỗi kết nối server');
    }
  };

  const passwordInputStyle = {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d0d7de',
    fontSize: 16,
    outline: 'none',
    transition: 'border 0.2s',
    paddingRight: 38,
  };
  const eyeIconStyle = {
    position: 'absolute',
    right: 12,
    top: 36,
    cursor: 'pointer',
    color: '#888',
  };

  const getMessageBoxStyle = (success) => ({
    marginTop: 10,
    padding: '10px 16px',
    borderRadius: 8,
    background: success ? 'linear-gradient(90deg, #d4fc79 0%, #96e6a1 100%)' : 'linear-gradient(90deg, #ffe0e0 0%, #ffb3b3 100%)',
    color: success ? '#218838' : '#c0392b',
    fontWeight: 500,
    textAlign: 'center',
    fontSize: 16,
    minHeight: 24,
    boxShadow: '0 2px 8px rgba(46,204,64,0.08)',
    opacity: 1,
    transition: 'opacity 0.3s',
    border: success ? '1.5px solid #27ae60' : '1.5px solid #e74c3c',
    letterSpacing: 0.5,
  });

  return (
    <>
      <GlobalStyle />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0ffe8 0%, #cfdef3 100%)', padding: 16, marginTop: 80 }}>
        <div style={{ display: 'flex', gap: 20, maxWidth: 900, width: '100%' }}>
          {/* Form đổi mật khẩu (bên trái) */}
          <form onSubmit={handleChangePassword} style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)', padding: 36, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#2ecc40', letterSpacing: 1 }}>Đổi mật khẩu</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
              <label htmlFor="oldPassword" style={{ fontWeight: 500, color: '#222' }}>Mật khẩu cũ</label>
              <input
                id="oldPassword"
                type={showOldPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu cũ"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
                style={passwordInputStyle}
              />
              <span onClick={() => setShowOldPassword(v => !v)} style={eyeIconStyle}>
                {!showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
              <label htmlFor="newPassword" style={{ fontWeight: 500, color: '#222' }}>Mật khẩu mới</label>
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                style={passwordInputStyle}
              />
              <span onClick={() => setShowNewPassword(v => !v)} style={eyeIconStyle}>
                {!showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
              <label htmlFor="confirmPassword" style={{ fontWeight: 500, color: '#222' }}>Xác nhận mật khẩu mới</label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                style={passwordInputStyle}
              />
              <span onClick={() => setShowConfirmPassword(v => !v)} style={eyeIconStyle}>
                {!showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: '12px 0',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(90deg, #2ecc40 0%, #27ae60 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 18,
                letterSpacing: 1,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(46,204,64,0.10)',
                transition: 'background 0.2s',
              }}
            >Đổi mật khẩu</button>
            {messagePassword && (
              <div style={getMessageBoxStyle(messagePassword.includes('thành công'))}>{messagePassword}</div>
            )}
          </form>

          {/* Form sửa thông tin cá nhân (bên phải) */}
          <form onSubmit={handleUpdateProfile} style={{ flex: 1, background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)', padding: 36, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#2ecc40', letterSpacing: 1 }}>Sửa thông tin cá nhân</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="fullName" style={{ fontWeight: 500, color: '#222' }}>Họ và tên</label>
              <input
                id="fullName"
                type="text"
                placeholder="Nhập họ và tên"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #d0d7de',
                  fontSize: 16,
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="phone" style={{ fontWeight: 500, color: '#222' }}>Số điện thoại</label>
              <input
                id="phone"
                type="text"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #d0d7de',
                  fontSize: 16,
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="address" style={{ fontWeight: 500, color: '#222' }}>Địa chỉ</label>
              <input
                id="address"
                type="text"
                placeholder="Nhập địa chỉ"
                value={address}
                onChange={e => setAddress(e.target.value)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #d0d7de',
                  fontSize: 16,
                  outline: 'none',
                  transition: 'border 0.2s',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                marginTop: 8,
                padding: '12px 0',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(90deg, #2ecc40 0%, #27ae60 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 18,
                letterSpacing: 1,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(46,204,64,0.10)',
                transition: 'background 0.2s',
              }}
            >Lưu thông tin</button>
            {messageProfile && (
              <div style={getMessageBoxStyle(messageProfile.includes('thành công'))}>{messageProfile}</div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfile;