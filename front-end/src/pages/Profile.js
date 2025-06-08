import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const TABS = [
  { label: 'Thông tin tài khoản', icon: '👤' },
  { label: 'Lịch sử mua hàng', icon: '📦' },
];

const Wrapper = styled.div`
  min-height: 100vh;
  background: #fcf9f2;
  padding: 120px 0 80px 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 0 0 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #231b10;
  margin-bottom: 32px;
  letter-spacing: 1px;
`;

const TabList = styled.div`
  display: flex;
  align-items: center;
  background: #f6f1e6;
  border-radius: 12px 12px 0 0;
  padding: 0 32px;
  gap: 32px;
  border-bottom: 1.5px solid #f0e6d2;
`;

const Tab = styled.button`
  background: none;
  border: none;
  outline: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ active }) => (active ? '#231b10' : '#6a6649')};
  border-bottom: ${({ active }) => (active ? '3px solid #bfa76a' : '3px solid transparent')};
  padding: 18px 24px 12px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  transition: color 0.2s, border 0.2s;
`;

const TabPanel = styled.div`
  background: #f6f1e6;
  border-radius: 0 0 12px 12px;
  padding: 40px 48px 48px 48px;
  min-height: 420px;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: #231b10;
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
`;

const Label = styled.div`
  min-width: 120px;
  color: #bfa76a;
  font-weight: 600;
  font-size: 1rem;
`;

const Value = styled.div`
  color: #231b10;
  font-size: 1rem;
  font-weight: 500;
`;

const Input = styled.input`
  background: transparent;
  border: none;
  border-bottom: 1.5px solid #e0d9c3;
  font-size: 1rem;
  color: #231b10;
  padding: 8px 0;
  width: 100%;
  outline: none;
  margin-bottom: 8px;
  &::placeholder {
    color: #bfa76a;
    opacity: 1;
  }
`;

const EditLink = styled.button`
  background: none;
  border: none;
  color: #bfa76a;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 12px;
`;

const OrderCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #e0d9c355;
  margin-bottom: 28px;
  padding: 24px 28px;
`;
const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;
const OrderId = styled.div`
  font-weight: 700;
  color: #231b10;
`;
const OrderDate = styled.div`
  color: #bfa76a;
  font-size: 0.98rem;
`;
const OrderStatus = styled.div`
  font-weight: 600;
  color: #527328;
`;
const OrderTotal = styled.div`
  font-weight: 600;
  color: #6a6649;
`;
const OrderProducts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-bottom: 8px;
`;
const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f6f1e6;
  border-radius: 8px;
  padding: 8px 12px;
`;
const ProductImg = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  background: #eee;
`;
const ProductName = styled.div`
  font-size: 1rem;
  color: #231b10;
`;
const ProductQty = styled.div`
  color: #bfa76a;
  font-size: 0.95rem;
`;
const DetailLink = styled.a`
  color: #bfa76a;
  font-weight: 600;
  text-decoration: underline;
  font-size: 1rem;
  margin-left: 8px;
  &:hover { color: #6a6649; }
`;

function translateStatus(status) {
  switch (status) {
    case 'PENDING': return 'Chờ xác nhận';
    case 'CONFIRMED': return 'Đã xác nhận';
    case 'SHIPPED': return 'Đang giao';
    case 'DELIVERED': return 'Đã giao';
    case 'CANCELLED': return 'Đã hủy';
    default: return status;
  }
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ fullName: '', email: '', phone: '', address: '', role: '', status: '' });
  const [tab, setTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    setUser({
      fullName: localStorage.getItem('fullName') || '',
      email: localStorage.getItem('email') || '',
      phone: localStorage.getItem('phone') || '',
      address: localStorage.getItem('address') || '',
      role: localStorage.getItem('role') || '',
      status: localStorage.getItem('status') || '',
    });
  }, []);

  useEffect(() => {
    if (tab !== 1) return;
    setLoadingOrders(true);
    axios.get(`${BACKEND_URL}/orders/customer/${userId}`)
      .then(res => setOrders(res.data))
      .catch(err => {
        toast.error('Không thể tải lịch sử đơn hàng');
        setOrders([]);
      })
      .finally(() => setLoadingOrders(false));
  }, [tab, userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Wrapper>
      <Container>
        <Title>TÀI KHOẢN</Title>
        <TabList>
          {TABS.map((t, idx) => (
            <Tab key={t.label} active={tab === idx} onClick={() => setTab(idx)}>
              <span>{t.icon}</span> {t.label}
            </Tab>
          ))}
        </TabList>
        <TabPanel>
          {tab === 0 && (
            <>
              <SectionTitle>Thông tin tài khoản</SectionTitle>
              <InfoRow>
                <Label>Email</Label>
                <Value>{user.email || 'Chưa cập nhật'}</Value>
                <EditLink onClick={() => navigate('/edit-profile')}>✏️ Đổi Thông Tin</EditLink>
                <EditLink onClick={handleLogout}>Đăng xuất</EditLink>
              </InfoRow>
              <hr style={{ border: 'none', borderTop: '1px solid #e0d9c3', margin: '18px 0' }} />
              <SectionTitle>Thông tin cá nhân</SectionTitle>
              <InfoRow>
                <Label>Họ và tên</Label>
                <Input value={user.fullName} placeholder="Họ và tên" disabled />
              </InfoRow>
              <InfoRow>
                <Label>Số điện thoại</Label>
                <Input value={user.phone} placeholder="Nhập số điện thoại" disabled />
              </InfoRow>
              <InfoRow>
                <Label>Địa chỉ</Label>
                <Input value={user.address} placeholder="Nhập địa chỉ" disabled />
              </InfoRow>
            </>
          )}
          {tab === 1 && (
            <>
              <SectionTitle>Lịch sử mua hàng</SectionTitle>
              {loadingOrders ? (
                <div style={{ color: '#bfa76a', fontStyle: 'italic' }}>Đang tải đơn hàng...</div>
              ) : orders.length === 0 ? (
                <div style={{ color: '#bfa76a', fontStyle: 'italic' }}>Bạn chưa có đơn hàng nào</div>
              ) : (
                orders.map(order => (
                  <OrderCard key={order._id}>
                    <OrderHeader>
                      <OrderId>Đơn #{order._id.slice(-6).toUpperCase()}</OrderId>
                      <OrderDate>{new Date(order.createdAt).toLocaleString()}</OrderDate>
                      <OrderStatus>{translateStatus(order.status)}</OrderStatus>
                    </OrderHeader>
                    <OrderProducts>
                      {order.items.map((item, idx) => (
                        <ProductItem key={idx}>
                          {item.productId?.images?.[0] && (
                            <ProductImg
                              src={`${BACKEND_URL}${item.productId.images[0]}`}
                              alt={item.name}
                              onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
                            />
                          )}
                          <div>
                            <ProductName>{item.name}</ProductName>
                            <ProductQty>x{item.quantity}</ProductQty>
                          </div>
                        </ProductItem>
                      ))}
                    </OrderProducts>
                    <OrderTotal>Tổng tiền: {order.total.toLocaleString()} VND</OrderTotal>
                    <div style={{ marginTop: 8 }}>
                      <DetailLink href={`/my-orders/${order._id}`}>Xem chi tiết</DetailLink>
                    </div>
                  </OrderCard>
                ))
              )}
            </>
          )}
        </TabPanel>
      </Container>
    </Wrapper>
  );
};

export default Profile;