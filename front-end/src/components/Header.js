import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart } from "react-icons/fa";

const dropdownMenuStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  background: "white",
  color: "black",
  minWidth: 180,
  boxShadow: "0 4px 16px rgba(46,204,64,0.10)",
  zIndex: 1000,
  borderRadius: "0 0 12px 12px",
  padding: "10px 0 6px 0",
  display: "none",
  fontFamily: "inherit",
  fontSize: 16,
  marginTop: 12,
};

const navItemStyle = {
  position: "relative",
  display: "inline-block",
};

const getNavLinkStyle = (isHeaderActive) => ({
  margin: "0 10px",
  textDecoration: "none",
  fontWeight: "500",
  color: isHeaderActive ? "black" : "white",
  padding: "8px 12px",
  transition:
    "color 0.35s cubic-bezier(0.4,0,0.2,1), border-bottom-color 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s cubic-bezier(0.4,0,0.2,1)",
  cursor: "pointer",
  fontSize: 18,
  position: "relative",
  borderBottom: "3px solid transparent",
});

const dropdownLinkStyle = {
  display: "block",
  padding: "8px 20px",
  color: "black",
  textDecoration: "none",
  fontWeight: 400,
  fontSize: 16,
  whiteSpace: "nowrap",
};

const iconStyle = {
  marginLeft: "15px",
  cursor: "pointer",
  fontSize: 24,
};

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

  const activeStyle = {
    backgroundColor: "white",
    color: "black",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };
  const defaultStyle = {
    backgroundColor: "transparent",
    color: "white",
    boxShadow: "none",
  };
  const headerStyle = {
    position: "fixed",
    top: 0,
    width: "100%",
    height: "160px",
    boxSizing: "border-box",
    padding: "0 40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition:
      "background-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease",
    zIndex: 999,
    ...(shouldApplyHoverStyle ? activeStyle : defaultStyle),
  };
  const containerStyle = {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0 auto",
  };

  // Dropdown menu logic
  const handleDropdown = (name) => setOpenDropdown(name);
  const closeDropdown = () => setOpenDropdown(null);

  // Thêm hàm xác định menu cha đang active (hover hoặc dropdown mở)
  const isMenuActive = (name) => openDropdown === name;

  return (
    <>
      {/* Hiệu ứng border-bottom lướt từ trái sang phải cho menu cha */}
      <style>{`
        .nav-animated {
          position: relative;
          display: inline-block;
        }
        .nav-animated span {
          position: relative;
          z-index: 1;
        }
        .nav-animated::after {
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
        .nav-animated.active::after,
        .nav-animated:hover::after {
          width: 60%;
        }
      `}</style>
      <header
        style={headerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          closeDropdown();
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Hàng trên: Cờ Việt Nam, logo, tên thương hiệu */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 12,
              marginBottom: 12,
              position: "relative",
            }}
          >
            {/* Logo và tên thương hiệu */}
            <span
              style={{
                fontWeight: "bold",
                fontSize: 32,
                color: "inherit",
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              Kyo Matcha
            </span>
          </div>
          {/* Cờ Việt Nam bên trái */}
          <img
            src="/vn-flag.png"
            alt="VN Flag"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg";
            }}
            style={{
              position: "absolute",
              left: 0,
              width: 48,
              height: 32,
              objectFit: "cover",
              borderRadius: 0,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          />

          {/* Icon bên phải, dùng position absolute để luôn sát phải */}
          <div
            style={{
              position: "absolute",
              right: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaUser
              style={{ ...iconStyle, color: 'black' }}
              onClick={() => {
                if (localStorage.getItem('token')) {
                  navigate('/profile');
                } else {
                  navigate('/login');
                }
              }}
            />
            {/* <FaSearch style={iconStyle} /> */}
            <Link to="/login"><FaShoppingCart style={{ ...iconStyle, color: 'black' }} /></Link>
          </div>
          {/* Navbar + Icon */}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Navbar căn giữa */}
            <nav style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <div style={navItemStyle} onMouseEnter={() => closeDropdown()}>
                <Link to="/" style={getNavLinkStyle(shouldApplyHoverStyle)}>
                  Trang chủ
                </Link>
              </div>
              <div
                className={`nav-animated${
                  isMenuActive("about") ? " active" : ""
                }`}
                style={navItemStyle}
                onMouseEnter={() => handleDropdown("about")}
                onMouseLeave={closeDropdown}
              >
                <span
                  style={{
                    ...getNavLinkStyle(shouldApplyHoverStyle),
                    borderBottom: "none",
                  }}
                >
                  Giới thiệu
                </span>
                <div
                  style={{
                    ...dropdownMenuStyle,
                    display: openDropdown === "about" ? "block" : "none",
                  }}
                >
                  <Link to="/about" style={dropdownLinkStyle}>
                    Về chúng tôi
                  </Link>
                  <Link to="/history" style={dropdownLinkStyle}>
                    Lịch sử trà Nhật
                  </Link>
                </div>
              </div>
              <div
                className={`nav-animated${
                  isMenuActive("product") ? " active" : ""
                }`}
                style={navItemStyle}
                onMouseEnter={() => handleDropdown("product")}
                onMouseLeave={closeDropdown}
              >
                <span
                  style={{
                    ...getNavLinkStyle(shouldApplyHoverStyle),
                    borderBottom: "none",
                  }}
                >
                  Sản phẩm
                </span>
                <div
                  style={{
                    ...dropdownMenuStyle,
                    display: openDropdown === "product" ? "block" : "none",
                  }}
                >
                  <Link to="/matcha" style={dropdownLinkStyle}>
                    Matcha
                  </Link>
                  <Link to="/tools" style={dropdownLinkStyle}>
                    Dụng cụ trà đạo
                  </Link>
                  <Link to="/barista-tools" style={dropdownLinkStyle}>
                    Dụng cụ pha chế
                  </Link>
                </div>
              </div>
              <div
                className={`nav-animated${
                  isMenuActive("blog") ? " active" : ""
                }`}
                style={navItemStyle}
                onMouseEnter={() => handleDropdown("blog")}
                onMouseLeave={closeDropdown}
              >
                <span
                  style={{
                    ...getNavLinkStyle(shouldApplyHoverStyle),
                    borderBottom: "none",
                  }}
                >
                  Blog
                </span>
                <div
                  style={{
                    ...dropdownMenuStyle,
                    display: openDropdown === "blog" ? "block" : "none",
                  }}
                >
                  <Link to="/discover-matcha" style={dropdownLinkStyle}>
                    Khám phá về Matcha
                  </Link>
                  <Link to="/beauty" style={dropdownLinkStyle}>
                    Làm đẹp
                  </Link>
                  <Link to="/recipes" style={dropdownLinkStyle}>
                    Pha chế
                  </Link>
                </div>
              </div>
              <div style={navItemStyle} onMouseEnter={() => closeDropdown()}>
                <Link
                  to="/contact"
                  style={getNavLinkStyle(shouldApplyHoverStyle)}
                >
                  Liên hệ
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
