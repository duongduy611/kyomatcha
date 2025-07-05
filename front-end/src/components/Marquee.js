import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

// 1. Định nghĩa animation bằng keyframes helper
const scrollLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    /* Di chuyển sang trái một khoảng bằng 50% chiều rộng của chính nó */
    transform: translateX(-200%);
  }
`;

// 2. Tạo các styled components
const MarqueeContainer = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
  border-bottom: 1px solid #EAE0D1;
  /* Tạm dừng animation khi hover */
  &:hover .marquee-content {
    animation-play-state: paused;
  }
`;

const MarqueeContent = styled.div`
  display: flex;
  white-space: nowrap;
  /* Áp dụng animation và nhận 'duration' từ props */
  animation: ${scrollLeft} ${props => props.duration} linear infinite;
`;

const MarqueeText = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 3rem;
  color: #527328;
  text-transform: uppercase;
  padding-right: 80px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    padding-right: 40px;
  }
`;

// 3. Xây dựng React component
const Marquee = ({ text, duration }) => {
  return (
    <MarqueeContainer>
      {/* Thêm className để selector :hover ở trên hoạt động */}
      <MarqueeContent className="marquee-content" duration={duration}>
        {/* Nhân đôi nội dung để tạo vòng lặp liền mạch */}
        <MarqueeText>{text}</MarqueeText>
        <MarqueeText>{text}</MarqueeText>
        <MarqueeText>{text}</MarqueeText>
        <MarqueeText>{text}</MarqueeText>
        <MarqueeText>{text}</MarqueeText>
        <MarqueeText>{text}</MarqueeText>
      </MarqueeContent>
    </MarqueeContainer>
  );
};

// Định nghĩa kiểu và giá trị mặc định cho props
Marquee.propTypes = {
  text: PropTypes.string.isRequired,
  duration: PropTypes.string,
};

Marquee.defaultProps = {
  duration: '25s',
};

export default Marquee;