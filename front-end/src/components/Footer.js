import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logo1 from "../assets/logo/kyo-matcha-logo.png";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

const FooterWrapper = styled.footer`
  background: #f6f6ee;
  padding: 0;
  color: #000;
  border-top: 1px solid #e0e0e0;
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 30px 20px 30px;
  display: flex;
  justify-content: space-between;
  gap: 40px;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 30px;
    padding: 30px 10px 10px 10px;
  }
`;

const FooterCol = styled.div`
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LogoBox = styled.div`
  display: flex;
  align-items: flex-start;
  height: 40px;
`;

const Logo = styled.img`
  height: 150px;
  width: auto;
  border-radius: 4px;
`;

const FooterTitle = styled.div`
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 8px;
`;

const FooterLink = styled(Link)`
  color: #000;
  text-decoration: none;
  font-size: 15px;
  margin-bottom: 4px;
  &:hover {
    text-decoration: underline;
  }
`;

const ContactText = styled.div`
  font-size: 15px;
  margin-bottom: 2px;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const NewsletterInput = styled.input`
  background: #fff;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  font-size: 15px;
  width: 180px;
  outline: none;
`;

const SubscribeButton = styled.button`
  background: #111;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 18px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #333;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 4px;
`;

const SocialIcon = styled.a`
  color: #000;
  background: #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #222;
    color: #fff;
  }
`;

const Copyright = styled.div`
  color: #000;
  font-size: 14px;
  text-align: center;
  padding: 18px 0 10px 0;
  border-top: 1px solid #e0e0e0;
  background: transparent;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterCol>
          <LogoBox>
            <Link to="/">
              <Logo src={logo1} alt="logo" />
            </Link>
          </LogoBox>
        </FooterCol>
        <FooterCol>
          <FooterTitle>Chính sách</FooterTitle>
          <FooterLink to="/terms">Điều khoản sử dụng</FooterLink>
          <FooterLink to="/privacy">Chính sách bảo mật</FooterLink>
          <FooterLink to="/accessibility">Tính trợ năng</FooterLink>
        </FooterCol>
        <FooterCol>
          <FooterTitle>Liên hệ</FooterTitle>
          <ContactText>Trường Đại học FPT</ContactText>
          <ContactText>Điện thoại: 0987 65 4321 – 0123 45 6789</ContactText>
          <ContactText>Email: kyomatcha@gmail.com</ContactText>
        </FooterCol>
        <FooterCol>
          <FooterTitle>Đăng ký</FooterTitle>
          <NewsletterForm onSubmit={e => e.preventDefault()}>
            <NewsletterInput type="email" placeholder="Nhập email của bạn..." />
            <SubscribeButton type="submit">Đăng ký</SubscribeButton>
          </NewsletterForm>
          <SocialIcons>
            <SocialIcon href="#" aria-label="Facebook"><FaFacebookF /></SocialIcon>
            <SocialIcon href="#" aria-label="Twitter"><FaTwitter /></SocialIcon>
            <SocialIcon href="#" aria-label="YouTube"><FaYoutube /></SocialIcon>
            <SocialIcon href="#" aria-label="Instagram"><FaInstagram /></SocialIcon>
          </SocialIcons>
        </FooterCol>
      </FooterContent>
      <Copyright>
        © 2025 KyoMatcha. All Rights Reserved
      </Copyright>
    </FooterWrapper>
  );
};

export default Footer;
