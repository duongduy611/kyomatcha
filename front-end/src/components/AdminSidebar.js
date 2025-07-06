import React from 'react';
import styled from 'styled-components';

// --- STYLED COMPONENTS ---
const SidebarContainer = styled.div`
  width: 250px;
  background-color: #332c28;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  flex-shrink: 0;
`;

const SidebarLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  padding: 0 1.5rem 1.5rem 1.5rem;
  border-bottom: 1px solid #2d3748;
  text-align: center;
`;

const NavMenu = styled.nav`
  margin-top: 1.5rem;
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;

  /* Dynamic styling based on 'active' prop */
  background-color: ${(props) => (props.active ? '#4a5568' : 'transparent')};
  color: ${(props) => (props.active ? '#ffffff' : '#eedecc')};

  &:hover {
    background-color: #2d3748;
    color: #ffffff;
  }
`;

// --- COMPONENT ---
const AdminSidebar = ({ activePage }) => {
  return (
    <SidebarContainer>
      <SidebarLogo>ADMIN</SidebarLogo>
      <NavMenu>
        <NavLink href="/admin/users" active={activePage === 'users'}>
          Khách Hàng
        </NavLink>
        <NavLink href="/admin/products" active={activePage === 'products'}>
          Sản phẩm
        </NavLink>
        <NavLink href="/admin/orders" active={activePage === 'orders'}>
          Đơn Hàng
        </NavLink>
      </NavMenu>
    </SidebarContainer>
  );
};

export default AdminSidebar;