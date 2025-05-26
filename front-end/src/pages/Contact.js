import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyle from "../components/GlobalStyle";

const ContactWrapper = styled.div`
  padding-top: 180px;
  background: #f4f4f4;
  padding-bottom: 48px;
`;
const Section = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;
const ContactContent = styled.div`
  display: flex;
  gap: 48px;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;
const ContactInfo = styled.div`
  flex: 1 1 350px;
  min-width: 320px;
`;
const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 18px;
  color: #222;
`;
const AddressText = styled.div`
  font-size: 1.1rem;
  margin-bottom: 16px;
`;
const InfoLine = styled.div`
  margin-bottom: 8px;
  color: #444;
`;
const ContactForm = styled.form`
  flex: 1 1 350px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
const Input = styled.input`
  font-family: 'Montserrat', sans-serif;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  &:focus {
    border-color: #8bc34a;
  }
`;
const TextArea = styled.textarea`
  font-family: 'Montserrat', sans-serif;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  resize: vertical;
  &:focus {
    border-color: #8bc34a;
  }
`;
const SubmitButton = styled.button`
  font-family: 'Montserrat', sans-serif;
  background: #8bc34a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #689f38;
  }
`;
const MapWrapper = styled.div`
  width: 100%;
  margin-top: 32px;
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
      const res = await fetch("http://localhost:9999/api/add-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Gửi thông tin thành công!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setError(data.message || "Gửi thông tin thất bại.");
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  return (
    <>
      <GlobalStyle />
      <ContactWrapper>
        <Section>
          <ContactContent>
            <ContactInfo>
              <SectionTitle>Address</SectionTitle>
              <AddressText>
                <b>
                  Khu Giáo dục và Đào tạo – Khu Công nghệ cao Hòa Lạc – Km29 Đại
                  lộ Thăng Long, H. Thạch Thất, TP. Hà Nội
                </b>
              </AddressText>
              <InfoLine>
                <b>Hotline/Zalo:</b> 0987 65 4321 – 0123 45 6789.
              </InfoLine>
              <InfoLine>
                <b>Email:</b> kyomatcha@gmail.com – matchachacha@gmail.com
              </InfoLine>
            </ContactInfo>
            <ContactForm onSubmit={handleSubmit}>
              <Input
                type="text"
                name="name"
                placeholder="Tên khách hàng"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <TextArea
                name="message"
                placeholder="Nội dung"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
              />
              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Đang gửi..." : "GỬI THÔNG TIN"}
              </SubmitButton>
              {success && <div style={{ color: "green" }}>{success}</div>}
              {error && <div style={{ color: "red" }}>{error}</div>}
            </ContactForm>
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
