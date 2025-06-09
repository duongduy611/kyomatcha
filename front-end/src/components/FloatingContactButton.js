import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import fbIcon from '../assets/images/Fb-icon.png';
import tiktokIcon from '../assets/images/Tiktok-icon.png';

const FloatingWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
`;

const IconButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const MessengerImg = styled.img`
  width: 36px;
  height: 36px;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.15);
  }
`;

const popupAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
`;

const Popup = styled.div`
  position: absolute;
  bottom: 70px;
  margin-right: -5px;
  right: 0;
  display: flex;
  flex-direction: column;
  animation: ${popupAnimation} 0.8s ease forwards;
`;

const LinkItem = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #527328;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
  width: 100%;  
  &:hover {
    color: #6A6649;
    text-decoration: underline;
  }
`;

const FacebookIcon = styled.img`
  width: 76px;
  height: 76px;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.2);
  }
  margin-left: -8px;
`;

const TiktokIcon = styled.img`
  width: 60px;
  height: 60px;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.2);
  }
`;

const FloatingContactButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <FloatingWrapper>
      {open && (
        <Popup>
          <LinkItem href="https://www.facebook.com/profile.php?id=61576877652764" target="_blank" rel="noopener noreferrer">
            <FacebookIcon src={fbIcon} alt="Facebook" />
          </LinkItem>
          <LinkItem href="https://www.tiktok.com/@yourtiktok" target="_blank" rel="noopener noreferrer" >
            <TiktokIcon src={tiktokIcon} alt="TikTok" />
          </LinkItem>
        </Popup>
      )}

      <IconButton onClick={() => setOpen(!open)}>
        <MessengerImg
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRww2qtjG8rFZF17ghorE6_ZieMa7JxSqbVvQ&s"
          alt="Messenger Icon"
        />
      </IconButton>
    </FloatingWrapper>
  );
};

export default FloatingContactButton;