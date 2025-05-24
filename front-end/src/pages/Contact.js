import React from "react";
import styled from "styled-components";
import GlobalStyle from "../components/GlobalStyle";

const Contact = () => {
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
          <ContactForm>
            <Input type="text" placeholder="Tên khách hàng" />
            <Input type="email" placeholder="Email" />
            <Input type="text" placeholder="Số điện thoại" />
            <Input type="text" placeholder="Tiêu đề" />
            <TextArea placeholder="Nội dung" rows={4} />
            <SubmitButton>GỬI THÔNG TIN</SubmitButton>
          </ContactForm>
        </ContactContent>
        <MapWrapper>
          <iframe
            title="Đại học FPT"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1514087464645!2d105.52692797482272!3d21.027761980620796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313452af2307a6a7%3A0xd6b7e28d27b5f6e0!2sFPT%20University!5e0!3m2!1svi!2s!4v1716547637202!5m2!1svi!2s"
            width="100%"
            height="350"
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
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

export default Contact;
