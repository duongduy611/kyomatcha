import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import styled, { css } from "styled-components";
import logoImg from '../assets/logo/logo.jpg';
import logoImg2 from '../assets/logo/logo2.jpg';

const HeaderWrapper = styled.header`
  font-family: 'Montserrat', sans-serif;
  position: fixed;
  top: 0;
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
  z-index: 999;
  background-color: ${({ active }) => (active ? 'white' : 'transparent')};
  color: ${({ active }) => (active ? 'black' : 'white')};
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const TopRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 12px 0;
`;

const Logo = styled.img`
  height: 80px;
  width: auto;
  display: block;
`;

const VNFlag = styled.img`
  width: 48px;
  height: 32px;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-left: 15px;
    font-size: 24px;
    cursor: pointer;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const NavItem = styled.div`
  position: relative;
  display: inline-block;
  font-family: 'Montserrat', sans-serif;

  &.nav-animated::after {
    content: '';
    position: absolute;
    left: 20%;
    right: 20%;
    bottom: -6px;
    width: 0%;
    height: 3px;
    background: #2ecc40;
    border-radius: 2px;
    transition: width 0.2s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }

  &.nav-animated.active::after,
  &.nav-animated:hover::after {
    width: 60%;
  }
`;

const NavLink = styled(Link)`
  margin: 0 10px;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  color: ${({ active }) => (active ? 'black' : 'white')};
  border-bottom: 3px solid transparent;
  transition: color 0.35s cubic-bezier(0.4,0,0.2,1), border-bottom-color 0.35s, background 0.35s;
`;

const NavSpan = styled.span`
  ${props => css`
    color: ${props.active ? 'black' : 'white'};
    font-weight: 500;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.35s, border-bottom-color 0.35s, background 0.35s;
  `}
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  color: black;
  min-width: 180px;
  box-shadow: 0 4px 16px rgba(46,204,64,0.10);
  padding: 10px 0 6px 0;
  font-size: 16px;
  margin-top: 6px;
  display: ${({ show }) => (show ? 'block' : 'none')};
  z-index: 1000;
`;

const DropdownLink = styled(Link)`
  display: block;
  padding: 8px 20px;
  color: black;
  text-decoration: none;
  font-weight: 400;
  font-size: 16px;
  white-space: nowrap;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const shouldApplyHoverStyle = isScrolled || (!isHome || isHovered);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdown = (name) => setOpenDropdown(name);
  const closeDropdown = () => setOpenDropdown(null);
  const isMenuActive = (name) => openDropdown === name;

  return (
    <HeaderWrapper
      active={shouldApplyHoverStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        closeDropdown();
      }}
    >
      <HeaderContainer>
        <TopRow>
          <VNFlag
            src="/vn-flag.png"
            alt="VN Flag"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg';
            }}
          />
          <Link to="/">
            <Logo src={shouldApplyHoverStyle ? logoImg : logoImg2} alt="KyoMatcha Logo" />
          </Link>
          <IconGroup>
            <FaUser
              onClick={() => {
                if (localStorage.getItem('token')) {
                  navigate('/profile');
                } else {
                  navigate('/login');
                }
              }}
            />
            <FaShoppingCart />
          </IconGroup>
        </TopRow>
        <Nav>
          <NavItem onMouseEnter={() => closeDropdown()}>
            <NavLink to="/" active={shouldApplyHoverStyle}>Trang chủ</NavLink>
          </NavItem>
          <NavItem
            className={`nav-animated${isMenuActive('about-us') ? ' active' : ''}`}
            onMouseEnter={() => handleDropdown('about-us')}
            onMouseLeave={closeDropdown}
          >
            <NavLink to="/about-us" active={shouldApplyHoverStyle}>Giới thiệu</NavLink>
            <DropdownMenu show={isMenuActive('about-us')}>
              <DropdownLink to="/about-us">Về chúng tôi</DropdownLink>
              <DropdownLink to="/history">Lịch sử trà Nhật</DropdownLink>
            </DropdownMenu>
          </NavItem>
          <NavItem
            className={`nav-animated${isMenuActive('product') ? ' active' : ''}`}
            onMouseEnter={() => handleDropdown('product')}
            onMouseLeave={closeDropdown}
          >
            <NavSpan active={shouldApplyHoverStyle}>Sản phẩm</NavSpan>
            <DropdownMenu show={isMenuActive('product')}>
              <DropdownLink to="/matcha">Matcha</DropdownLink>
              <DropdownLink to="/tools">Dụng cụ trà đạo</DropdownLink>
              <DropdownLink to="/barista-tools">Dụng cụ pha chế</DropdownLink>
            </DropdownMenu>
          </NavItem>
          <NavItem
            className={`nav-animated${isMenuActive('blog') ? ' active' : ''}`}
            onMouseEnter={() => handleDropdown('blog')}
            onMouseLeave={closeDropdown}
          >
            <NavLink to="/blog" active={shouldApplyHoverStyle}>Blog</NavLink>
            <DropdownMenu show={isMenuActive('blog')}>
              <DropdownLink to="/discover-matcha">Khám phá về Matcha</DropdownLink>
              <DropdownLink to="/beauty">Làm đẹp</DropdownLink>
              <DropdownLink to="/recipe">Pha chế</DropdownLink>
            </DropdownMenu>
          </NavItem>
          <NavItem onMouseEnter={() => closeDropdown()}>
            <NavLink to="/contact" active={shouldApplyHoverStyle}>Liên hệ</NavLink>
          </NavItem>
        </Nav>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;
