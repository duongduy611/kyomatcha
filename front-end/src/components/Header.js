import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import logoImg from "../assets/logo/kyo-matcha-logo.png";
import logoImg2 from "../assets/logo/kyo-matcha-logo.png";
import { useAppContext } from "../context/AppContext";

const HeaderFixedWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 999;
`;

const Topbar = styled.div`
  width: 100vw;
  background: #23201b;
  color: #fff;
  font-size: 13px;
  text-align: center;
  padding: 10px 0 10px 0;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.2px;
`;

const HeaderWrapper = styled.header`
  font-family: "Montserrat", sans-serif;
  position: relative;
  width: 100vw;
  min-width: 0;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f6f6ee;
  color: black;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 80px;
`;

const LeftGroup = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CenterGroup = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const Logo = styled.img`
  height: 110px;
  width: auto;
  display: block;
`;

const NavItem = styled.div`
  position: relative;
  display: inline-block;
  font-family: "Montserrat", sans-serif;

  &.nav-animated::after {
    content: "";
    position: absolute;
    left: 20%;
    right: 20%;
    bottom: -6px;
    width: 0%;
    height: 3px;
    background: #4A7C59;
    border-radius: 2px;
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
  color: black;
  border-bottom: 3px solid transparent;
  transition: color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    border-bottom-color 0.35s, background 0.35s;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  color: black;
  min-width: 180px;
  box-shadow: 0 4px 16px rgba(46, 204, 64, 0.1);
  padding: 10px 0 6px 0;
  font-size: 16px;
  margin-top: 6px;
  display: ${({ show }) => (show ? "block" : "none")};
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

const slideIn = keyframes`
  from {
    transform: translateX(-100%) scale(0.98);
    opacity: 0.2;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(44, 41, 36, 0.45);
  z-index: 2001;
  display: flex;
`;

const ModalContent = styled.div`
  width: 50vw;
  min-width: 340px;
  max-width: 700px;
  height: 100vh;
  background: #fcfaf3;
  color: #23201b;
  padding: 40px 48px 32px 48px;
  overflow-y: auto;
  position: relative;
  animation: ${slideIn} 0.45s cubic-bezier(0.4,0,0.2,1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 32px;
  background: none;
  border: none;
  font-size: 24px;
  color: #23201b;
  cursor: pointer;
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setSelectedCategory,
    setSelectedBlogCategory,
  } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("token"));

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

  const handleBlogCategoryClick = (path, category) => {
    setSelectedBlogCategory(category || "");
    navigate('/blog');
    closeDropdown();
  };

  return (
    <HeaderFixedWrapper>
      <Topbar onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
        Tận hưởng giao hàng miễn phí toàn quốc với hoá đơn từ 99.000 đ
      </Topbar>
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            <div style={{marginTop: 24}}>
              <h3 style={{fontWeight: 600}}>Phí vận chuyển</h3>
              <p>Với hóa đơn từ 99.000đ : miễn phí vận chuyển toàn quốc<br/>
              Với hóa đơn dưới 99.000đ: phí vận chuyển mặc định 30.000đ áp dụng toàn quốc.</p>
              <h3 style={{fontWeight: 600}}>Thời gian giao hàng</h3>
              <ul>
                <li><b>Đơn hàng nội thành TP.HCM:</b><br/>Thời gian giao hàng là 2-7 ngày sau khi đặt hàng.</li>
                <li><b>Đơn hàng ở ngoại thành Tp.HCM và các tỉnh thành khác:</b><br/>Thời gian là 2-15 ngày đối với khu vực trung tâm tỉnh thành phố, 5-15 ngày đối với khu vực huyện, xã, thị trấn... (Không tính chủ nhật hay các ngày lễ tết) Có thể thay đổi thời gian giao hàng trong một số trường hợp bất khả kháng như: chịu ảnh hưởng của thiên tai, dịch Covid hoặc các sự kiện đặc biệt khác.</li>
                <li><b>Lưu ý:</b> Đơn hàng đặt mua tại website: cocoonvietnam.com sẽ được chúng tôi chuyển phát đến các bạn thông qua 2 đơn vị vận chuyển chính: GIAO HÀNG TIẾT KIỆM Hoặc NETPOST. Đặc biệt, thông tin hóa đơn dán bên ngoài kiện hàng luôn luôn có logo có giá của thương hiệu để nhận biết các sản phẩm là chính hãng.</li>
              </ul>
              <p style={{fontStyle: 'italic', marginTop: 16}}>
                Để kiểm tra thông tin hoặc tình trạng đơn hàng của quý khách, xin vui lòng nhắn tin vào Fanpage hoặc gọi số Hotline, cung cấp tên, số điện thoại, mã đơn hàng (nếu có) để được kiểm tra.
              </p>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
      <HeaderWrapper
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          closeDropdown();
        }}
      >
        <HeaderContainer>
          <LeftGroup>
            <NavItem onMouseEnter={() => closeDropdown()}>
              <NavLink
                to="/products"
                onClick={() => setSelectedCategory("")}
              >
                Sản phẩm
              </NavLink>
            </NavItem>
            <NavItem
              className={`nav-animated${isMenuActive("about") ? " active" : ""}`}
              onMouseEnter={() => handleDropdown("about")}
              onMouseLeave={closeDropdown}
            >
              <NavLink to="/about-us">
                Giới thiệu
              </NavLink>
              <DropdownMenu show={isMenuActive("about")}>
                <DropdownLink to="/about-us" onClick={() => setSelectedCategory("")}>Về chúng tôi</DropdownLink>
                <DropdownLink to="/history" onClick={() => setSelectedCategory("")}>Lịch sử trà Nhật</DropdownLink>
              </DropdownMenu>
            </NavItem>
            <NavItem
              className={`nav-animated${isMenuActive("blog") ? " active" : ""}`}
              onMouseEnter={() => handleDropdown("blog")}
              onMouseLeave={closeDropdown}
            >
              <NavLink
                to="/blog"
                onClick={() => handleBlogCategoryClick("", "Tất cả")}
              >
                Bài viết
              </NavLink>
              <DropdownMenu show={isMenuActive("blog")}>
                <DropdownLink to="/blog" onClick={() => handleBlogCategoryClick("discover-matcha", "Khám phá về Matcha")}>Khám phá về Matcha</DropdownLink>
                <DropdownLink to="/blog" onClick={() => handleBlogCategoryClick("beauty", "Làm đẹp")}>Làm đẹp</DropdownLink>
                <DropdownLink to="/blog" onClick={() => handleBlogCategoryClick("recipe", "Pha chế")}>Pha chế</DropdownLink>
              </DropdownMenu>
            </NavItem>
          </LeftGroup>
          <CenterGroup>
            <Link to="/" onClick={() => setSelectedCategory("")}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Logo
                src={isScrolled || isHovered ? logoImg : logoImg2}
                alt="KyoMatcha Logo"
              />
            </Link>
          </CenterGroup>
          <RightGroup>
            <NavLink
              to={isLoggedIn ? "/profile" : "/login"}
              onClick={() => {
                if (isLoggedIn) {
                  navigate("/profile");
                } else {
                  navigate("/login");
                }
              }}
            >
              {isLoggedIn ? "Tài khoản" : "Đăng nhập"}
            </NavLink>
            <NavLink to="/cart" onClick={() => navigate("/cart")}>Giỏ hàng</NavLink>
            <NavLink to="/contact">Liên hệ</NavLink>
          </RightGroup>
        </HeaderContainer>
      </HeaderWrapper>
    </HeaderFixedWrapper>
  );
};

export default Header;