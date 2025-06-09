import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GlobalStyle from "../components/GlobalStyle";
import styled from "styled-components";
import logoImg from "../assets/logo/logo1.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f6ee;
  margin-top: 0;
  padding: 160px 0 80px 0;
`;

const RegisterContainer = styled.div`
  display: flex;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(64, 64, 64, 0.1);
  overflow: hidden;
  max-width: 800px;
  width: 100%;
  min-height: 440px;
`;

const LogoSide = styled.div`
  background: linear-gradient(
    135deg,
    rgb(250, 253, 225) 0%,
    rgb(251, 249, 239) 100%
  );
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
  border: 1.5px solid #b9bf9e;
  font-size: 16px;
  outline: none;
  background: #f6f6ee;
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
  color: #6a6649;
`;

const SubmitButton = styled.button`
  margin-top: 8px;
  padding: 12px 0;
  border-radius: 10px;
  border: none;
  background: linear-gradient(
    90deg,
    rgb(112, 146, 68) 0%,
    rgb(191, 178, 81) 100%
  );
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 2px 8px #b9bf9e33;
  transition: background 0.2s;
`;

const Message = styled.div`
  color: ${({ success }) => (success ? "#527328" : "#d32f2f")};
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
      color: #6a6649;
    }
  }
`;

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: form đăng ký, 2: nhập OTP
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Validate các trường bắt buộc
    if (!email || !password || !confirmPassword || !fullName) {
      toast.warning("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@[\w-]+(\.[\w-]+)+$/;
    if (!emailRegex.test(email)) {
      toast.warning("Email không hợp lệ!");
      return;
    }

    if (phone && !/^0\d{9}$/.test(phone)) {
      toast.warning("Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0!");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // ✅ Check email đã tồn tại chưa
      const checkRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/check-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const checkData = await checkRes.json();

      if (checkData.exists) {
        toast.error("Email đã tồn tại. Vui lòng dùng email khác.");
        return;
      }
      // ✅ Gửi OTP nếu email hợp lệ và chưa tồn tại
      
      setOtp('');
      setStep(2);
      const otpRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const otpData = await otpRes.json();

      if (otpRes.ok) {
        toast.success(
          "Mã xác thực đã gửi về email. Vui lòng nhập để xác minh."
        );
      setResendCooldown(30);
      } else {
        toast.error(otpData.message || "Không thể gửi mã OTP.");
      }
    } catch (err) {
      console.error("🔥 Lỗi hệ thống:", err);
      toast.error("Không thể kết nối đến máy chủ.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      // 1. Gửi mã OTP để xác minh
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const result = await res.json();

      if (!res.ok) {
        console.error("❌ Xác minh OTP thất bại:", result);
        toast.error(result.message || "OTP không đúng hoặc đã hết hạn.");
        return;
      }

      // 2. Gửi đăng ký
      const registerRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, fullName, phone, address }),
        }
      );
      const regData = await registerRes.json();

      if (!registerRes.ok) {
        console.error("❌ Đăng ký thất bại:", regData);
        toast.error(regData.message || "Đăng ký thất bại.");
        return;
      }

      toast.success("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("🔥 Lỗi hệ thống:", err);
      toast.error("Lỗi xác minh hoặc đăng ký.");
    }
  };
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return; // tránh spam khi countdown đang chạy

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Đã gửi lại mã OTP!");
        setResendCooldown(30); // bắt đầu đếm ngược 60s
      } else {
        toast.error(data.message || "Không thể gửi lại mã OTP.");
      }
    } catch (err) {
      toast.error("Lỗi khi gửi lại mã OTP.");
      console.error(err);
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
            <RegisterForm
              onSubmit={
                step === 1
                  ? handleRegister
                  : (e) => {
                      e.preventDefault();
                      handleVerifyOtp();
                    }
              }
            >
              <Title>Đăng ký</Title>

              {step === 1 && (
                <>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Họ và tên"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <PasswordWrapper>
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <EyeIcon
                      onClick={() => setShowPassword((v) => !v)}
                      style={{ marginTop: 12 }}
                    >
                      {!showPassword ? <FaEyeSlash /> : <FaEye />}
                    </EyeIcon>
                  </PasswordWrapper>
                  <PasswordWrapper>
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <EyeIcon
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      style={{ marginTop: 12 }}
                    >
                      {!showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </EyeIcon>
                  </PasswordWrapper>
                  <SubmitButton type="submit">Xác minh & Đăng ký</SubmitButton>
                </>
              )}

              {step === 2 && (
                <>
                  <Label htmlFor="otp">Mã OTP đã gửi tới email</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />

                  {/* Countdown hiển thị ngay dưới input OTP */}
                  <div
                    style={{
                      textAlign: "center",
                      margin: "8px 0",
                      color: "#6A6649",
                    }}
                  >
                    {resendCooldown > 0 ? (
                      `Bạn có thể gửi lại mã sau ${resendCooldown} giây`
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        style={{
                          background: "none",
                          color: "#527328",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "600",
                          marginLeft: "-65%",
                          textDecoration: "underline",
                        }}
                      >
                        Gửi lại mã OTP
                      </button>
                    )}
                  </div>

                  <SubmitButton type="submit">Xác minh & Đăng ký</SubmitButton>

                  <div style={{ marginTop: "12px", textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => {setStep(1);setResendCooldown(0);setOtp('');}}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#6A6649",
                        textDecoration: "underline",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Quay lại đăng ký
                    </button>
                  </div>
                </>
              )}

              <Message success={message.includes("thành công")}>
                {message}
              </Message>

              {step === 1 && (
                <LoginPrompt>
                  <span>Bạn đã có tài khoản?</span>
                  <Link to="/login" onClick={() => window.scrollTo(0, 0)}>
                    Đăng nhập
                  </Link>
                </LoginPrompt>
              )}
            </RegisterForm>
            {/* <ToastContainer position="top-center" autoClose={3000} /> */}
          </FormSide>
        </RegisterContainer>
      </RegisterWrapper>
    </>
  );
}

export default Register;
