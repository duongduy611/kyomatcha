import React from 'react';
import styled from 'styled-components';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  height: 80px;
  flex-shrink: 0;
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

const AdminHeader = ({ searchPlaceholder, searchTerm, onSearchChange }) => {
  return (
    <HeaderContainer>
      <HeaderSearch>
        <FaSearch />
        <input
          type="text"
          placeholder={searchPlaceholder || "Tìm kiếm..."}
          value={searchTerm}
          onChange={onSearchChange}
        />
      </HeaderSearch>
      <HeaderIcons>
        <FaBell />
        <FaUserCircle />
      </HeaderIcons>
    </HeaderContainer>
  );
};

export default AdminHeader;