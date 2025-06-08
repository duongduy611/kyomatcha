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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
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
  @media (max-width: 600px) {
    padding: 18px 4px 6px 4px;
    gap: 18px;
  }
`;

const FooterCol = styled.div`
  flex: 1;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 600px) {
    align-items: center;
    min-width: unset;
    gap: 8px;
  }
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
  @media (max-width: 900px) {
    height: 100px;
  }
  @media (max-width: 600px) {
    height: 60px;
  }
`;

const FooterTitle = styled.div`
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 8px;
  @media (max-width: 600px) {
    font-size: 15px;
    margin-bottom: 4px;
  }
`;

const FooterLink = styled(Link)`
  color: #000;
  text-decoration: none;
  font-size: 15px;
  margin-bottom: 4px;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const ContactText = styled.div`
  font-size: 15px;
  margin-bottom: 2px;
  @media (max-width: 600px) {
    font-size: 13px;
  }
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
  @media (max-width: 600px) {
    font-size: 13px;
    width: 120px;
    padding: 6px 8px;
  }
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
  @media (max-width: 600px) {
    font-size: 13px;
    padding: 6px 12px;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 4px;
  @media (max-width: 600px) {
    justify-content: center;
    gap: 10px;
  }
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
  @media (max-width: 600px) {
    width: 26px;
    height: 26px;
    font-size: 15px;
  }
`;

const Copyright = styled.div`
  color: #000;
  font-size: 14px;
  text-align: center;
  padding: 18px 0 10px 0;
  border-top: 1px solid #e0e0e0;
  background: transparent;
  @media (max-width: 600px) {
    font-size: 12px;
    padding: 10px 0 6px 0;
  }
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

// import React from "react";
// import styled, { keyframes } from "styled-components";

// const float = keyframes`
//   0%, 100% { transform: translateY(0px); }
//   50% { transform: translateY(-10px); }
// `;

// const FooterContainer = styled.footer`
//   display: flex;
//   min-height: 500px;

//   @media (max-width: 768px) {
//     flex-direction: column;
//   }
// `;

// const FooterImage = styled.div`
//   width: 50%;
//   background: url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') center/cover no-repeat;
//   position: relative;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   @media (max-width: 768px) {
//     width: 100%;
//     min-height: 300px;
//   }
// `;

// const Hearts = styled.div`
//   position: absolute;
//   top: 20px;
//   left: 20px;
// `;

// const Heart = styled.span`
//   color: #ff6b9d;
//   font-size: ${props => props.small ? '18px' : '24px'};
//   margin-right: 5px;
//   animation: ${float} 3s ease-in-out infinite;
//   animation-delay: ${props => props.delay || '0s'};
// `;

// const FooterContent = styled.div`
//   width: 50%;
//   padding: 60px 40px;

//   @media (max-width: 768px) {
//     width: 100%;
//   }
// `;

// const NewsletterSection = styled.div`
//   margin-bottom: 50px;
// `;

// const NewsletterTitle = styled.h3`
//   font-size: 24px;
//   font-weight: 600;
//   color: #333;
//   margin-bottom: 15px;
//   line-height: 1.4;
// `;

// const NewsletterForm = styled.form`
//   display: flex;
//   margin-top: 20px;
// `;

// const EmailInput = styled.input`
//   flex: 1;
//   padding: 12px 16px;
//   border: 1px solid #ddd;
//   border-radius: 25px 0 0 25px;
//   font-size: 14px;
//   outline: none;
//   color: #666;

//   &::placeholder {
//     color: #999;
//   }
// `;

// const SubmitButton = styled.button`
//   background-color: #333;
//   color: white;
//   border: none;
//   padding: 12px 20px;
//   border-radius: 0 25px 25px 0;
//   cursor: pointer;
//   font-size: 14px;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #555;
//   }
// `;

// const NewsletterDesc = styled.p`
//   font-size: 12px;
//   color: #999;
//   margin-top: 10px;
//   line-height: 1.5;
// `;

// const FooterLinks = styled.div`
//   display: flex;
//   gap: 60px;

//   @media (max-width: 768px) {
//     flex-direction: column;
//     gap: 30px;
//   }
// `;

// const LinkColumn = styled.div`
//   flex: 1;
// `;

// const ColumnTitle = styled.h4`
//   font-size: 14px;
//   font-weight: 600;
//   color: #333;
//   margin-bottom: 20px;
// `;

// const LinkList = styled.ul`
//   list-style: none;
// `;

// const LinkItem = styled.li`
//   margin-bottom: 12px;
// `;

// const FooterLink = styled.a`
//   color: #666;
//   text-decoration: none;
//   font-size: 13px;
//   transition: color 0.3s;

//   &:hover {
//     color: #333;
//   }
// `;

// const SocialLinks = styled.div`
//   margin-top: 30px;
// `;

// const SocialTitle = styled.h4`
//   font-size: 14px;
//   font-weight: 600;
//   color: #333;
//   margin-bottom: 15px;
// `;

// const SocialList = styled.ul`
//   list-style: none;
// `;

// const SocialItem = styled.li`
//   margin-bottom: 8px;
// `;

// const SocialLink = styled.a`
//   color: #666;
//   text-decoration: none;
//   font-size: 13px;
//   transition: color 0.3s;

//   &:hover {
//     color: #ff6b9d;
//   }
// `;

// const FooterBottom = styled.div`
//   margin-top: 40px;
//   padding-top: 20px;
//   border-top: 1px solid #eee;
//   text-align: right;
// `;

// const BottomLink = styled.a`
//   color: #999;
//   text-decoration: none;
//   font-size: 12px;
// `;

// const Footer = () => (
//   <FooterContainer>
//     <FooterImage>
//       <Hearts>
//         <Heart>♥</Heart>
//         <Heart small delay="0.5s">♥</Heart>
//       </Hearts>
//     </FooterImage>

//     <FooterContent>
//       <NewsletterSection>
//         <NewsletterTitle>
//           Đăng ký để nhận thông tin khuyến mãi sớm nhất từ Cocoon
//         </NewsletterTitle>
//         <NewsletterForm>
//           <EmailInput type="email" placeholder="Nhập địa chỉ email" />
//           <SubmitButton type="submit">→</SubmitButton>
//         </NewsletterForm>
//         <NewsletterDesc>
//           Đăng ký để nhận thông tin liên tục về các sản phẩm, dịch vụ của hãng, sự kiện hấp dẫn cũng như dịch vụ chăm sóc đặc biệt từ Cocoon.
//         </NewsletterDesc>
//       </NewsletterSection>

//       <FooterLinks>
//         <LinkColumn>
//           <ColumnTitle>Đặt hàng & Hỗ trợ</ColumnTitle>
//           <LinkList>
//             {['Hỏi đáp', 'Hướng dẫn mua hàng', 'Chính sách bán hàng', 'Điều khoản bảo mật', 'Điều kiện chung', 'Liên hệ chúng tôi'].map(text => (
//               <LinkItem key={text}><FooterLink href="#">{text}</FooterLink></LinkItem>
//             ))}
//           </LinkList>
//         </LinkColumn>

//         <LinkColumn>
//           <ColumnTitle>Shop</ColumnTitle>
//           <LinkList>
//             {['Sản Phẩm Mới', 'Dưỡng Da', 'Chăm Sóc Tóc', 'Tắm & Dưỡng Thể', 'Dưỡng Môi', 'Combo / Bộ Sản Phẩm'].map(text => (
//               <LinkItem key={text}><FooterLink href="#">{text}</FooterLink></LinkItem>
//             ))}
//           </LinkList>
//         </LinkColumn>
//       </FooterLinks>

//       <FooterLinks style={{ marginTop: "30px" }}>
//         <LinkColumn>
//           <ColumnTitle>Về Cocoon</ColumnTitle>
//           <LinkList>
//             {['Câu chuyện thương hiệu', 'Giá trị cốt lõi', 'Trách nhiệm cộng đồng', 'Tìm hiểu nguyên liệu'].map(text => (
//               <LinkItem key={text}><FooterLink href="#">{text}</FooterLink></LinkItem>
//             ))}
//           </LinkList>
//         </LinkColumn>

//         <LinkColumn>
//           <SocialLinks>
//             <SocialTitle>Mạng xã hội</SocialTitle>
//             <SocialList>
//               {['Facebook →', 'Instagram →', 'Youtube →'].map(text => (
//                 <SocialItem key={text}><SocialLink href="#">{text}</SocialLink></SocialItem>
//               ))}
//             </SocialList>
//           </SocialLinks>
//         </LinkColumn>
//       </FooterLinks>

//       <FooterBottom>
//         <BottomLink href="#">Liên hệ</BottomLink>
//       </FooterBottom>
//     </FooterContent>
//   </FooterContainer>
// );

// export default Footer;
