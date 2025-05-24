import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GlobalStyle from '../components/GlobalStyle';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    // Validate các trường
    if (!username || !email || !password || !confirmPassword || !fullName) {
      setMessage('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    if (!/^\w+@gmail\.com$/.test(email)) {
      setMessage('Email phải là địa chỉ @gmail.com hợp lệ!');
      return;
    }
    if (phone && !/^0\d{8}$/.test(phone)) {
      setMessage('Số điện thoại phải có 9 số và bắt đầu bằng số 0!');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp!');
      return;
    }
    try {
      const res = await fetch('http://localhost:9999/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, fullName, phone, address }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Đăng ký thành công! Bạn có thể đăng nhập.');
        setUsername(''); setEmail(''); setPassword(''); setConfirmPassword(''); setFullName(''); setPhone(''); setAddress('');
        setTimeout(() => navigate('/login'), 600);
      } else {
        setMessage(data.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setMessage('Lỗi kết nối server');
    }
  };

  return (
    <>
      <GlobalStyle />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgb(181, 248, 193) 0%, #cfdef3 100%)' }}>
        <form
          onSubmit={handleRegister}
          style={{
            width: 400,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            marginTop: 130,
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#2ecc40', letterSpacing: 1 }}>Đăng ký</h2>
          <input type="text" placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} required style={inputStyle} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          <input type="text" placeholder="Họ và tên" value={fullName} onChange={e => setFullName(e.target.value)} required style={inputStyle} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
            <label htmlFor="password" style={{ fontWeight: 500, color: '#222' }}>Mật khẩu</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: 38 }}
            />
            <span onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 12, top: 36, cursor: 'pointer', color: '#888' }}>
              {!showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
            <label htmlFor="confirmPassword" style={{ fontWeight: 500, color: '#222' }}>Xác nhận mật khẩu</label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={{ ...inputStyle, paddingRight: 38 }}
            />
            <span onClick={() => setShowConfirmPassword(v => !v)} style={{ position: 'absolute', right: 12, top: 36, cursor: 'pointer', color: '#888' }}>
              {!showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" style={buttonStyle}>Đăng ký</button>
          <div style={{ color: message === 'Đăng ký thành công! Bạn có thể đăng nhập.' ? '#27ae60' : 'red', minHeight: 24, textAlign: 'center', fontWeight: 500 }}>{message}</div>
        </form>
      </div>
    </>
  );
}

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #d0d7de',
  fontSize: 16,
  outline: 'none',
  transition: 'border 0.2s',
  marginBottom: 4,
};
const buttonStyle = {
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
};

export default Register;