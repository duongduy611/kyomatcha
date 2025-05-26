import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styled   from 'styled-components';
import logoImg from '../assets/logo/logo.jpg';



const LoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgb(181, 248, 193) 0%, #cfdef3 100%);
  margin-top: 80px;
  `;

const LoginContainer = styled.div`
  display: flex;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  overflow: hidden;
  max-width: 800px;
  width: 100%;
  min-height: 440px;
`;

const LogoSide = styled.div`
  background: linear-gradient(135deg, #e8f8f5 0%, #d4efdf 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 340px;
  min-width: 220px;
  padding: 32px 16px;
  @media (max-width: 700px) {
    display: none;
  }
`;

const LogoImg = styled.img`
  width: 180px;
  height: auto;
  border-radius: 20%;
  box-shadow: 0 2px 12px rgba(46,204,64,0.10);
`;

const FormSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 32px;
  @media (max-width: 700px) {
    width: 100%;
    padding: 32px 12px;
  }
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 8px;
  color: #2ecc40;
  letter-spacing: 1px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #222;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d0d7de;
  font-size: 16px;
  outline: none;
  transition: border 0.2s;
  width: 100%;
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 36px;
  cursor: pointer;
  color: #888;
`;

const SubmitButton = styled.button`
  margin-top: 8px;
  padding: 12px 0;
  border-radius: 8px;
  border: none;
  background: linear-gradient(90deg, #2ecc40 0%, #27ae60 100%);
  color: #fff;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(46,204,64,0.10);
  transition: background 0.2s;
`;

const Message = styled.div`
  color: ${({ success }) => (success ? '#27ae60' : 'red')};
  min-height: 24px;
  text-align: center;
  font-weight: 500;
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 8px;
  span {
    color: #222;
  }
  a {
    color: #2ecc40;
    font-weight: 500;
    text-decoration: underline;
    margin-left: 4px;
  }
`;

function Login() {
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
        localStorage.setItem('id', data.id || '');
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
    <>
    <LoginWrapper>
      <LoginContainer>
        <LogoSide>
          <LogoImg src={logoImg} alt="KyoMatcha Logo" />
        </LogoSide>
        <FormSide>
          <LoginForm onSubmit={handleLogin}>
            <Title>Đăng nhập</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Label htmlFor="loginInput">Tên đăng nhập hoặc Email</Label>
              <Input
                id="loginInput"
                type="text"
                placeholder="Nhập tên đăng nhập hoặc email"
                value={loginInput}
                onChange={e => setLoginInput(e.target.value)}
                required
              />
            </div>
            <PasswordWrapper>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <EyeIcon onClick={() => setShowPassword(v => !v)}>
                {!showPassword ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </PasswordWrapper>
            <SubmitButton type="submit">Đăng nhập</SubmitButton>
            <Message success={message === 'Đăng nhập thành công!'}>{message}</Message>
            <RegisterLink>
              <span>Bạn chưa có tài khoản?</span>
              <Link to="/register" onClick={() => window.scrollTo(0, 0)}>Đăng ký ngay</Link>
            </RegisterLink>
          </LoginForm>
        </FormSide>
      </LoginContainer>
    </LoginWrapper>
    </>
  );
}

export default Login;
