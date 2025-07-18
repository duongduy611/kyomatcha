import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyle from "../components/GlobalStyle";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ContactWrapper = styled.div`
  margin-top: 100px;
  padding-top: 100px;
  padding-bottom: 20px;
`;

const Section = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  span {
    color: #4A7C59;
    font-style: italic;
  }
`;

const FormSubtitle = styled.div`
  font-size: 14px;
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  &::after {
    content: " *";
    color: red;
  }
`;

const Input = styled.input`
  font-family: 'Montserrat', sans-serif;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #527328;
  }
`;

const TextArea = styled.textarea`
  font-family: 'Montserrat', sans-serif;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  &:focus {
    border-color: #527328;
  }
`;

const SubmitButton = styled.button`
  background: #527328;
  color: #fff;
  border: 2px solid #527328;
  padding: 14px 38px;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 2px;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border 0.2s;
  font-family: "Montserrat", sans-serif;
  text-decoration: none;
  text-align: center;

  &:hover {
    background: transparent;
    color: #527328;
    border: 2px solid #527328;
  }
`;

const ContactInfo = styled.div`
  background: transparent;
  border: 1px solid #527328;
  padding: 40px;
  border-radius: 8px;
`;

const InfoSection = styled.div`
  margin-bottom: 30px;
`;

const InfoTitle = styled.h3`
  font-size: 18px;
  margin-top: 15px;
  margin-bottom: 10px;
  font-weight: 500;
`;

const InfoText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

const SocialIcon = styled.a`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #527328;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    color: #527328;
    border: 1px solid #527328;
    background: transparent;
    transform: translateY(-3px);
  }
`;

const MapWrapper = styled.div`
  width: 100%;
  margin-top: 50px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/add-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Gửi thông tin thành công!");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(data.message || "Gửi thông tin thất bại.");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  return (
    <>
      <GlobalStyle />
      <ContactWrapper>
        <Section>
          <ContactContent>
            <ContactForm onSubmit={handleSubmit}>
              <FormTitle>Liên hệ với KyoMatcha</FormTitle>
              <FormSubtitle>Hãy liên hệ với chúng tôi để được hỗ trợ tốt nhất</FormSubtitle>
              <InputGroup>
                <Label>Tên của bạn</Label>
                <Input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label>Email của bạn</Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label>Nội dung bạn muốn gửi</Label>
                <TextArea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Đang gửi..." : "GỬI THÔNG TIN"}
              </SubmitButton>
            </ContactForm>

            <ContactInfo>
              <InfoSection>
                <InfoTitle>Địa chỉ</InfoTitle>
                <InfoText>
                  Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại lộ Thăng Long, H. Thạch Thất, TP. Hà Nội
                </InfoText>
              </InfoSection>

              <InfoSection>
                <InfoTitle>Liên hệ</InfoTitle>
                <InfoText>Điện thoại: 0982826438</InfoText>
                <InfoText>Email: info.kyomatcha@gmail.com</InfoText>
              </InfoSection>

              <InfoSection>
                <InfoTitle>Giờ làm việc</InfoTitle>
                <InfoText>Thứ 2 - Thứ 6: 09:00 - 22:00</InfoText>
                <InfoText>Thứ 7 - Chủ nhật: 11:00 - 18:00</InfoText>
              </InfoSection>

              <InfoSection>
                <InfoTitle>Kết nối với chúng tôi</InfoTitle>
                <SocialLinks>
                  <SocialIcon href="https://www.facebook.com/kyomatchavn" target="_blank"><FaFacebookF /></SocialIcon>
                  <SocialIcon href="https://www.instagram.com/kyomatcha" target="_blank"><FaInstagram /></SocialIcon>
                  <SocialIcon href="https://www.tiktok.com/@kyomatcha.official" target="_blank"><FaTiktok /></SocialIcon>
                  <SocialIcon href="https://www.youtube.com/@kyomatcha" target="_blank"><FaYoutube /></SocialIcon>
                </SocialLinks>
              </InfoSection>
            </ContactInfo>
          </ContactContent>
          <MapWrapper>
            <iframe
              title="Đại học FPT"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4418.001515103656!2d105.52271427584111!3d21.012421688338517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be9d7d0b5abcbf4!2sFPT%20University!5e1!3m2!1sen!2s!4v1748186157723!5m2!1sen!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </MapWrapper>
        </Section>
      </ContactWrapper>
    </>
  );
};

export default Contact;
