import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GlobalStyle from '../components/GlobalStyle';
import styled from 'styled-components';
import logoImg from '../assets/logo/logo1.png';

const RegisterWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F6F6EE;
  margin-top: 0;
  padding: 160px 0 80px 0;

`;

const RegisterContainer = styled.div`
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
  background: linear-gradient(135deg, rgb(250, 253, 225) 0%, rgb(251, 249, 239) 100%);
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

const RegisterForm = styled.form`
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
  margin-bottom: 0;
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
  background: linear-gradient(90deg, rgb(112, 146, 68) 0%, rgb(191, 178, 81) 100%);
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

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 16px;
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

function Register() {
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
    if (!email || !password || !confirmPassword || !fullName) {
      setMessage('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    if (!/^\w+([\.-]?\w+)*@[\w-]+(\.[\w-]+)+$/.test(email)) {
      setMessage('Email không hợp lệ!');
      return;
    }
    if (phone && !/^0\d{9}$/.test(phone)) {
      setMessage('Số điện thoại phải có 10 số và bắt đầu bằng số 0!');
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
        body: JSON.stringify({ email, password, fullName, phone, address }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Đăng ký thành công! Bạn có thể đăng nhập.');
        setEmail(''); setPassword(''); setConfirmPassword(''); setFullName(''); setPhone(''); setAddress('');
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
    <RegisterWrapper>
      <RegisterContainer>
        <LogoSide>
          <LogoImg src={logoImg} alt="KyoMatcha Logo" />
        </LogoSide>
        <FormSide>
          <RegisterForm onSubmit={handleRegister}>
            <Title>Đăng ký</Title>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Họ và tên"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
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
              <EyeIcon onClick={() => setShowPassword(v => !v)} style={{ marginTop: 12 }}>
                {!showPassword ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </PasswordWrapper>
            <PasswordWrapper>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <EyeIcon onClick={() => setShowConfirmPassword(v => !v)} style={{ marginTop: 12 }}>
                {!showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </EyeIcon>
            </PasswordWrapper>
            <SubmitButton type="submit">Đăng ký</SubmitButton>
            <Message success={message === 'Đăng ký thành công! Bạn có thể đăng nhập.'}>{message}</Message>
            <LoginPrompt>
              <span>Bạn đã có tài khoản?</span>
              <Link to="/login" onClick={() => window.scrollTo(0, 0)}>Đăng nhập</Link>
            </LoginPrompt>
          </RegisterForm>
        </FormSide>
      </RegisterContainer>
    </RegisterWrapper>
    </>
  );
}

export default Register;