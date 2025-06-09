import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import logoImg from "../assets/logo/kyo-matcha-logo.png";
import logoImg2 from "../assets/logo/kyo-matcha-logo.png";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

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
  font-family: "Montserrat", sans-serif;
  letter-spacing: 0.2px;
`;

const TopbarContent = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    width: 0%;
    height: 1px;
    background: #fff;
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 0 auto;
  }

  &:hover::after {
    width: 100%;
  }
`;

const HeaderWrapper = styled.header`
  font-family: "Montserrat", sans-serif;
  position: relative;
  width: 100vw;
  min-width: 0;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f6f6ee;
  color: black;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  @media (max-width: 900px) {
    height: 60px;
  }
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
  @media (max-width: 900px) {
    padding: 0 10px;
    height: 60px;
  }
`;

const LeftGroup = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
  @media (max-width: 900px) {
    display: none;
  }
`;

const CenterGroup = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 900px) {
    justify-content: flex-start;
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  @media (max-width: 900px) {
    display: none;
  }
`;

const Logo = styled.img`
  height: 80px;
  width: auto;
  display: block;
  @media (max-width: 900px) {
    height: 48px;
  }
`;

const NavItem = styled.div`
  position: relative;
  display: inline-block;
  font-family: "Montserrat", sans-serif;

  &.nav-animated::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    width: 0%;
    height: 2px;
    background: #4a7c59;
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 0 auto;
  }

  &.nav-animated.active::after,
  &.nav-animated:hover::after {
    width: calc(100% - 24px); /* Trừ đi padding của NavLink */
  }
`;

const NavLink = styled(Link)`
  margin: 0;
  text-decoration: none;
  font-weight: 500;
  padding: 4px 12px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  color: black;
  transition: color 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  color: black;
  min-width: 180px;
  box-shadow: 0 4px 16px rgba(46, 204, 64, 0.1);
  ${'' /* padding: 10px 0 6px 0; */}
  font-size: 16px;
  margin-top: 3px;
  display: ${({ show }) => (show ? "block" : "none")};
  z-index: 1000;
`;

const DropdownLink = styled(Link)`
  display: block;
  padding: 8px 20px;
  color: black;
  text-decoration: none;
  font-weight: 400;
  font-size: 14px;
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
  max-width: 50%;
  height: 100vh;
  background: #fcfaf3;
  color: #23201b;
  padding: 40px 48px 32px 48px;
  overflow-y: auto;
  position: relative;
  animation: ${slideIn} 0.45s cubic-bezier(0.4, 0, 0.2, 1);
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

const HamburgerButton = styled.button`
  display: none;
  position: relative;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1201;
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  span {
    display: block;
    width: 24px;
    height: 3px;
    background: #23201b;
    margin: 4px 0;
    border-radius: 2px;
    transition: 0.3s;
  }
`;

const MobileMenuOverlay = styled.div`
  display: ${({ open }) => (open ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(44, 41, 36, 0.25);
  z-index: 1200;
`;

const MobileMenu = styled.nav`
  position: fixed;
  top: 0;
  left: ${({ open }) => (open ? "0" : "-80vw")};
  width: 80vw;
  max-width: 340px;
  height: 100vh;
  background: #f6f6ee;
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.08);
  z-index: 1201;
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  padding: 32px 24px 24px 24px;
  @media (min-width: 901px) {
    display: none;
  }
`;

const MobileMenuLink = styled(Link)`
  font-size: 1.1rem;
  color: #23201b;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 24px;
  letter-spacing: 1px;
  &:last-child {
    margin-bottom: 0;
  }
  &:hover {
    color: #4a7c59;
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setSelectedCategory, setSelectedBlogCategory } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <HeaderFixedWrapper>
      <Topbar>
        <TopbarContent onClick={() => setShowModal(true)}>
          Tận hưởng giao hàng miễn phí toàn quốc với hoá đơn từ 99.000 đ
        </TopbarContent>
      </Topbar>
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowModal(false)}>
              &times;
            </CloseButton>
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontWeight: 600 }}>Phí vận chuyển</h3>
              <p>
                Với hóa đơn từ 99.000đ : miễn phí vận chuyển toàn quốc
                <br />
                Với hóa đơn dưới 99.000đ: phí vận chuyển mặc định 30.000đ áp
                dụng toàn quốc.
              </p>
              <h3 style={{ fontWeight: 600 }}>Thời gian giao hàng</h3>
              <ul>
                <li>
                  <b>Đơn hàng nội thành TP.Hà Nội:</b>
                  <br />
                  Thời gian giao hàng là 2-7 ngày sau khi đặt hàng.
                </li>
                <li>
                  <b>
                    Đơn hàng ở ngoại thành TP.Hà Nội và các tỉnh thành khác:
                  </b>
                  <br />
                  Thời gian là 2-15 ngày đối với khu vực trung tâm tỉnh thành
                  phố, 5-15 ngày đối với khu vực huyện, xã, thị trấn... (Không
                  tính chủ nhật hay các ngày lễ tết) Có thể thay đổi thời gian
                  giao hàng trong một số trường hợp bất khả kháng như: chịu ảnh
                  hưởng của thiên tai, dịch Covid hoặc các sự kiện đặc biệt
                  khác.
                </li>
                <li>
                  <b>Lưu ý:</b> Đơn hàng đặt mua tại website: kyomatcha.id.vn sẽ
                  được chúng tôi chuyển phát đến các bạn thông qua 2 đơn vị vận
                  chuyển chính: GIAO HÀNG TIẾT KIỆM Hoặc NETPOST. Đặc biệt,
                  thông tin hóa đơn dán bên ngoài kiện hàng luôn luôn có logo có
                  giá của thương hiệu để nhận biết các sản phẩm là chính hãng.
                </li>
              </ul>
              <p style={{ fontStyle: "italic", marginTop: 16 }}>
                Để kiểm tra thông tin hoặc tình trạng đơn hàng của quý khách,
                xin vui lòng nhắn tin vào Fanpage hoặc gọi số Hotline, cung cấp
                tên, số điện thoại, mã đơn hàng (nếu có) để được kiểm tra.
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
          <HamburgerButton
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Mở menu"
          >
            <span />
            <span />
            <span />
          </HamburgerButton>
          <LeftGroup>
            <NavItem className="nav-animated">
              <NavLink to="/products" onClick={() => setSelectedCategory("")}>
                Sản phẩm
              </NavLink>
            </NavItem>
            <NavItem
              className={`nav-animated${
                isMenuActive("about") ? " active" : ""
              }`}
              onMouseEnter={() => handleDropdown("about")}
              onMouseLeave={closeDropdown}
            >
              <NavLink to="/about-us">Giới thiệu</NavLink>
              <DropdownMenu show={isMenuActive("about")}>
                <DropdownLink
                  to="/about-us"
                  onClick={() => setSelectedCategory("")}
                >
                  Về chúng tôi
                </DropdownLink>
                <DropdownLink
                  to="/history"
                  onClick={() => setSelectedCategory("")}
                >
                  Lịch sử trà Nhật
                </DropdownLink>
              </DropdownMenu>
            </NavItem>
            <NavItem className="nav-animated">
              <NavLink to="/blogs">Bài viết</NavLink>
            </NavItem>
          </LeftGroup>
          <CenterGroup>
            <Link
              to="/"
              onClick={() => setSelectedCategory("")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Logo
                src={isScrolled || isHovered ? logoImg : logoImg2}
                alt="KyoMatcha Logo"
              />
            </Link>
          </CenterGroup>
          <RightGroup>
            <NavItem className="nav-animated">
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
            </NavItem>
            <NavItem className="nav-animated">
              <MobileMenuLink
                to="/cart"
                onClick={(e) => {
                  const token = localStorage.getItem("token");
                  const userId = localStorage.getItem("userId");

                  if (!token || !userId) {
                    e.preventDefault(); // Ngăn chuyển trang
                    toast.info(
                      "Vui lòng đăng nhập để xem giỏ hàng"
                    );
                    navigate("/login");
                    return;
                  }

                  setMobileMenuOpen(false);
                }}
              >
                Giỏ hàng
              </MobileMenuLink>
            </NavItem>
            <NavItem className="nav-animated">
              <NavLink to="/contact">Liên hệ</NavLink>
            </NavItem>
          </RightGroup>
        </HeaderContainer>
        <MobileMenuOverlay
          open={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(false)}
        />
        <MobileMenu open={mobileMenuOpen}>
          <MobileMenuLink
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sản phẩm
          </MobileMenuLink>
          <MobileMenuLink
            to="/about-us"
            onClick={() => setMobileMenuOpen(false)}
          >
            Giới thiệu
          </MobileMenuLink>
          <MobileMenuLink
            to="/history"
            onClick={() => setMobileMenuOpen(false)}
          >
            Lịch sử trà Nhật
          </MobileMenuLink>
          <MobileMenuLink to="/blogs" onClick={() => setMobileMenuOpen(false)}>
            Bài viết
          </MobileMenuLink>
          <MobileMenuLink
            to={isLoggedIn ? "/profile" : "/login"}
            onClick={() => setMobileMenuOpen(false)}
          >
            {isLoggedIn ? "Tài khoản" : "Đăng nhập"}
          </MobileMenuLink>
          <MobileMenuLink
            to="/cart"
            onClick={(e) => {
              const token = localStorage.getItem("token");
              const userId = localStorage.getItem("userId");

              if (!token || !userId) {
                e.preventDefault(); // Ngăn chuyển trang
                toast.info("Vui lòng đăng nhập để xem vào giỏ hàng");
                navigate("/login");
                return;
              }

              setMobileMenuOpen(false);
            }}
          >
            Giỏ hàng
          </MobileMenuLink>
          <MobileMenuLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
          >
            Liên hệ
          </MobileMenuLink>
        </MobileMenu>
      </HeaderWrapper>
    </HeaderFixedWrapper>
  );
};

export default Header;
