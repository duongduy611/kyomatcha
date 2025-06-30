import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Các hằng số API ---
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:9999";
const USERS_API_URL = `${BACKEND_URL}/admin/users`;

// --- Styled Components (Nhiều component được tái sử dụng từ AdminProductPage) ---

const AdminPageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #FBF9F2;
  font-family: "Poppins", sans-serif;
`;
const Sidebar = styled.div`
  width: 250px;
  background-color: #1a202c;
  color: #a0aec0;
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
  color: #a0aec0;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  font-weight: 500;
  background-color: ${(props) => (props.active ? "#4a5568" : "transparent")};
  color: ${(props) => (props.active ? "#ffffff" : "#a0aec0")};
  &:hover {
    background-color: #2d3748;
    color: #ffffff;
  }
`;
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  height: 80px;
`;
const HeaderSearch = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  input {
    padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    width: 300px;
    font-size: 0.9rem;
    &:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 1px #4299e1;
    }
  }
  svg {
    position: absolute;
    left: 1rem;
    color: #718096;
  }
`;
const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #4a5568;
  svg {
    cursor: pointer;
    font-size: 1.25rem;
  }
`;
const ContentWrapper = styled.div`
  padding: 2rem;
  overflow-y: auto;
`;
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;
const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 600;
  color: #2d3748;
`;
const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  overflow: hidden;
`;
const TableHead = styled.thead`
  background-color: #edf2f7;
  th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.8rem;
    color: #4a5568;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;
const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  &:last-child {
    border-bottom: none;
  }
`;
const TableCell = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  color: #2d3748;
  vertical-align: middle;
`;
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.2rem;
  color: #718096;
`;
const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
`;
const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  background-color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
    color: #a0aec0;
  }
  &:not(:disabled):hover {
    background-color: #edf2f7;
  }
`;
const StatusBadge = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
  background-color: ${(props) => (props.isActive ? "#48bb78" : "#a0aec0")};
`;

// --- Component cho nút gạt (Toggle Switch) ---
const ToggleSwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
`;
const ToggleSwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  &:checked + span {
    background-color: #48bb78;
  }
  &:checked + span:before {
    transform: translateX(22px);
  }
`;
const ToggleSwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 28px;
  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

// --- COMPONENT CHÍNH CỦA TRANG QUẢN LÝ USER ---
const AdminUserPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${USERS_API_URL}`);
      setAllUsers(response.data.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await axios.patch(`${USERS_API_URL}/${userId}/status`, {
        status: newStatus,
      });
      setAllUsers(
        allUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
      toast.success(`Đã cập nhật trạng thái người dùng thành ${newStatus}.`);
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái người dùng.");
    }
  };

  const renderContent = () => {
    if (loading)
      return (
        <LoadingContainer>Đang tải danh sách người dùng...</LoadingContainer>
      );

    return (
      <>
        <UserTable>
          <TableHead>
            <tr>
              <th>Tên đầy đủ</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </TableHead>
          <tbody>
            {allUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "N/A"}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <StatusBadge isActive={user.status === "ACTIVE"}>
                    {user.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ToggleSwitchContainer>
                    <ToggleSwitchInput
                      type="checkbox"
                      checked={user.status === "ACTIVE"}
                      onChange={() => handleStatusToggle(user._id, user.status)}
                    />
                    <ToggleSwitchSlider />
                  </ToggleSwitchContainer>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </UserTable>
        <div style={{marginTop: 16, color: '#4a5568'}}>Tổng số người dùng: {allUsers.length}</div>
      </>
    );
  };

  return (
    <>
      <AdminPageContainer>
        <Sidebar>
          <SidebarLogo>ADMIN</SidebarLogo>
          <NavMenu>
            <NavLink href="/admin/products" >
              Sản phẩm
            </NavLink>
            <NavLink href="/admin/orders">Đơn Hàng</NavLink>
            <NavLink href="/admin/users" active>Khách Hàng</NavLink>
          </NavMenu>
        </Sidebar>
        <MainContent>
          <Header>
            <HeaderSearch>
              <FaSearch />
              <input type="text" placeholder="Tìm kiếm người dùng..." />
            </HeaderSearch>
            <HeaderIcons>
              <FaBell />
              <FaUserCircle />
            </HeaderIcons>
          </Header>
          <ContentWrapper>
            <PageHeader>
              <PageTitle>Quản lý Khách hàng</PageTitle>
            </PageHeader>
            {renderContent()}
          </ContentWrapper>
        </MainContent>
      </AdminPageContainer>
    </>
  );
};

export default AdminUserPage;
