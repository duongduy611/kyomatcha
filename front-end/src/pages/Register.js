import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GlobalStyle from '../components/GlobalStyle';
import styled from 'styled-components';
import logoImg from '../assets/logo/logo1.png';

const RegisterWrapper = styled.div`
  margin-top: 150px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
`;

const RegisterContainer = styled.div`
  display: flex;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  min-height: 500px;
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

const RegisterForm = styled.form`
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
  margin-bottom: 16px;
`;

const EyeIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
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

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 16px;
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