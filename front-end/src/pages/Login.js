import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const isEmail = /@gmail\.com$/.test(loginInput);
      const body = isEmail ? { email: loginInput, password } : { username: loginInput, password };
      const res = await fetch('http://localhost:9999/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username || '');
        localStorage.setItem('fullName', data.fullName || '');
        localStorage.setItem('email', data.email || '');
        localStorage.setItem('phone', data.phone || '');
        localStorage.setItem('address', data.address || '');
        localStorage.setItem('role', data.role || '');
        localStorage.setItem('status', data.status || '');
        setMessage('Đăng nhập thành công!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setMessage('Lỗi kết nối server');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,rgb(181, 248, 193) 0%, #cfdef3 100%)' }}>
      <form
        onSubmit={handleLogin}
        style={{
          width: 350,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          padding: '32px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          marginTop: 100,
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 8, color: '#2ecc40', letterSpacing: 1 }}>Đăng nhập</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="loginInput" style={{ fontWeight: 500, color: '#222' }}>Tên đăng nhập hoặc Email</label>
          <input
            id="loginInput"
            type="text"
            placeholder="Nhập tên đăng nhập hoặc email"
            value={loginInput}
            onChange={e => setLoginInput(e.target.value)}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
          <label htmlFor="password" style={{ fontWeight: 500, color: '#222' }}>Mật khẩu</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #d0d7de',
              fontSize: 16,
              outline: 'none',
              transition: 'border 0.2s',
              paddingRight: 38,
            }}
          />
          <span onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 12, top: 36, cursor: 'pointer', color: '#888' }}>
            {!showPassword ? <FaEyeSlash /> : <FaEye />}
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
        >Đăng nhập</button>
        <div style={{ color: message === 'Đăng nhập thành công!' ? '#27ae60' : 'red', minHeight: 24, textAlign: 'center', fontWeight: 500 }}>{message}</div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span>Bạn chưa có tài khoản? </span>
          <Link to="/register" style={{ color: '#2ecc40', fontWeight: 500, textDecoration: 'underline', marginLeft: 4 }}>Đăng ký ngay</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
