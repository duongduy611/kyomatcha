import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

// --- Các hằng số API ---
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:9999";
const USERS_API_URL = `${BACKEND_URL}/admin/users`;

// --- Utility function cho debounce ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// --- Styled Components (Nhiều component được tái sử dụng từ AdminProductPage) ---

const AdminPageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #FBF9F2;
`;
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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
  background-color: #fffcef;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  overflow: hidden;
`;
const TableHead = styled.thead`
  background-color: #eedecc;
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
  background-color: ${(props) => (props.isActive ? "#527328" : "#a0aec0")};
`;

const RoleSelect = styled.select`
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  font-size: 0.9rem;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 1px #4299e1;
  }
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
    background-color: #527328;
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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 10;

  // Debounce search term để tránh filter quá nhiều
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${USERS_API_URL}`);
      const users = response.data.data || [];
      setAllUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter users dựa trên search term
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user =>
        user.fullName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1); // Reset về trang 1 khi search
  }, [allUsers, debouncedSearchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Tính toán phân trang
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await axios.patch(`${USERS_API_URL}/${userId}/status`, {
        status: newStatus,
      });
      // Cập nhật lại state của user trên giao diện mà không cần gọi lại API
      const updateUserState = (users) =>
        users.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        );
      setAllUsers(updateUserState);
      setFilteredUsers(updateUserState);
      toast.success(`Đã cập nhật trạng thái người dùng thành ${newStatus}.`);
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái người dùng.");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    // Lấy thông tin user đang đăng nhập từ localStorage
    const currentUserId = localStorage.getItem("userId");
    if (userId === currentUserId) {
      toast.warn("Bạn không thể thay đổi vai trò của chính mình.");
      return;
    }

    try {
      await axios.patch(`${USERS_API_URL}/${userId}/role`, { role: newRole });

      const updateLogic = (prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        );

      setAllUsers(updateLogic);
      setFilteredUsers(updateLogic); // Cập nhật cả danh sách đã lọc

      toast.success(`Đã cập nhật vai trò người dùng thành ${newRole}.`);
    } catch (error) {
      toast.error("Lỗi khi cập nhật vai trò người dùng.");
      // Nếu có lỗi, gọi lại fetchUsers để đồng bộ lại dữ liệu chính xác từ server
      fetchUsers();
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
            {currentUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "N/A"}</TableCell>
                <TableCell>
                  <RoleSelect
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                  </RoleSelect>
                </TableCell>
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
        <PaginationContainer>
          <PaginationButton
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Trang trước
          </PaginationButton>
          <span>
            Trang {currentPage} / {totalPages || 1}
            ({totalUsers} người dùng)
          </span>
          <PaginationButton
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Trang sau
          </PaginationButton>
        </PaginationContainer>
      </>
    );
  };

  return (
    <>
      <AdminPageContainer>
        <AdminSidebar activePage="users" />
        <MainContent>
          <AdminHeader
            searchPlaceholder="Tìm kiếm người dùng..."
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
          />
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