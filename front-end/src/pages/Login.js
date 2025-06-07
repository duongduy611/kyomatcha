import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import GlobalStyle from '../components/GlobalStyle';
import styled   from 'styled-components';
import logoImg from '../assets/logo/kyo-matcha-logo.png';

const LoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F6F6EE;
  padding: 160px 0 80px 0;
`;

const LoginContainer = styled.div`
  display: flex;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(64, 64, 64, 0.10);
  overflow: hidden;
  max-width: 800px;
  width: 100%;
  min-height: 440px;
`;

const LogoSide = styled.div`
  background: linear-gradient(135deg,rgb(250, 253, 225) 0%,rgb(251, 249, 239) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 320px;
  min-width: 200px;
  padding: 32px 16px;
  @media (max-width: 700px) {
    display: none;
  }
`;

const LogoImg = styled.img`
  width: 160px;
  height: auto;
  border-radius: 20%;
  box-shadow: 0 2px 12px #b9bf9e44;
`;

const FormSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 36px;
  background: #fff;
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
  gap: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 8px;
  color: #527328;
  letter-spacing: 1px;
  font-size: 2rem;
  font-weight: 700;
`;

const Label = styled.label`
  font-weight: 500;
  color: #404040;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid #B9BF9E;
  font-size: 16px;
  outline: none;
  background: #F6F6EE;
  color: #404040;
  transition: border 0.2s;
  width: 100%;
  &:focus {
    border: 1.5px solid #527328;
    background: #fff;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 14px;
  top: 38px;
  cursor: pointer;
  color: #6A6649;
`;

const SubmitButton = styled.button`
  margin-top: 8px;
  padding: 12px 0;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg,rgb(112, 146, 68) 0%,rgb(191, 178, 81) 100%);
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 2px 8px #b9bf9e33;
  transition: background 0.2s;
`;

const Message = styled.div`
  color: ${({ success }) => (success ? '#527328' : '#d32f2f')};
  min-height: 24px;
  text-align: center;
  font-weight: 500;
  margin-top: 4px;
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 8px;
  span {
    color: #404040;
  }
  a {
    color: #527328;
    font-weight: 600;
    text-decoration: underline;
    margin-left: 4px;
    transition: color 0.2s;
    &:hover {
      color: #6A6649;
    }
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 10px 0;
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1.5px solid #B9BF9E;
  }
  span {
    padding: 0 10px;
    color: #6A6649;
    font-size: 15px;
    font-weight: 500;
  }
`;

const GoogleButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  border-radius: 10px;
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
      const body = { email: loginInput, password };
      const res = await fetch('http://localhost:9999/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.id || '');
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Google response:', credentialResponse);
      if (!credentialResponse.credential) {
        setMessage('Không nhận được thông tin xác thực từ Google');
        return;
      }
      
      const res = await fetch('http://localhost:9999/api/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: credentialResponse.credential
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.user.id || '');
        localStorage.setItem('username', data.user.username || '');
        localStorage.setItem('fullName', data.user.fullName || '');
        localStorage.setItem('email', data.user.email || '');
        localStorage.setItem('role', data.user.role || '');
        localStorage.setItem('status', data.user.status || '');
        setMessage('Đăng nhập thành công!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setMessage('Lỗi kết nối server');
    }
  };

  const handleGoogleError = () => {
    setMessage('Đăng nhập Google thất bại');
  };

  return (
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
                <EyeIcon onClick={() => setShowPassword(v => !v)} style={{ marginTop: "3%" }}>
                  {!showPassword ? <FaEyeSlash /> : <FaEye />}
                </EyeIcon>
              </PasswordWrapper>
              <SubmitButton type="submit">Đăng nhập</SubmitButton>
              <OrDivider>
                <span>HOẶC</span>
              </OrDivider>
              <GoogleButton>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  size="large"
                  shape="pill"
                  width="320"
                  text="signin_with"
                  theme="outline"
                  locale="vi"
                />
              </GoogleButton>
              <Message success={message === 'Đăng nhập thành công!'}>{message}</Message>
              <RegisterLink>
                <span>Bạn chưa có tài khoản?</span>
                <Link to="/register" onClick={() => window.scrollTo(0, 0)}>Đăng ký ngay</Link>
              </RegisterLink>
            </LoginForm>
          </FormSide>
        </LoginContainer>
      </LoginWrapper>
  );
}

export default Login;
