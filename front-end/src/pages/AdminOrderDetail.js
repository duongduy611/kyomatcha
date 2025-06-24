import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import OrderProgressBar from '../components/OrderProgressBar';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Wrapper = styled.div`
  min-height: 100vh;
  background: #fcf9f2;
  padding: 120px 0;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 32px;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: #231b10;
  margin-bottom: 24px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionHeader = styled.h4`
  font-size: 1.2rem;
  color: #6a6649;
  margin-bottom: 12px;
  border-bottom: 1px solid #e0d9c3;
  padding-bottom: 4px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

const InfoItem = styled.p`
  margin: 4px 0;
  color: #231b10;
  strong {
    color: #3d7925;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
`;

const ProductCard = styled.div`
  background: #f6f1e6;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
`;

const ProductImg = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const ProductName = styled.div`
  font-size: 1rem;
  color: #231b10;
  margin-bottom: 4px;
`;

const ProductQty = styled.div`
  font-size: 0.9rem;
  color: #527328;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #bfa76a;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
    console.log(order);
    
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${BACKEND_URL}/admin/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data.order);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <Wrapper><Container><Title>Đang tải...</Title></Container></Wrapper>;
  if (!order) return <Wrapper><Container><Title>Không tìm thấy đơn hàng</Title></Container></Wrapper>;

  const translateStatus = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'SHIPPED': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <Wrapper>
      <Container>
       
        <Title>Chi tiết Đơn hàng #{order._id.slice(-6).toUpperCase()}</Title>

        {/* Thông tin chung */}
        <Section>
          <SectionHeader>Thông tin đơn hàng</SectionHeader>
          <InfoGrid>
            <InfoItem><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString()}</InfoItem>
            <InfoItem><strong>Trạng thái:</strong> {translateStatus(order.status)}</InfoItem>
            <InfoItem><strong>Người tạo:</strong> {order.userId?.fullName}</InfoItem>
            <InfoItem><strong>Email:</strong> {order.userId?.email}</InfoItem>
          </InfoGrid>
        </Section>

        {/* Progress bar */}
        <Section>
          <OrderProgressBar status={order.status} />
        </Section>

        {/* Thông tin giao hàng */}
        {order.shippingInfo && (
          <Section>
            <SectionHeader>Thông tin giao hàng</SectionHeader>
            <InfoItem><strong>Địa chỉ:</strong> {order.shippingInfo.address}</InfoItem>
            <InfoItem><strong>Người nhận:</strong> {order.shippingInfo.receiverName} — {order.shippingInfo.phone}</InfoItem>
          </Section>
        )}

        {/* Payment Info */}
        {order.paymentInfo && (
          <Section>
            <SectionHeader>Thông tin thanh toán</SectionHeader>
            <InfoItem><strong>Phương thức:</strong> {order.paymentInfo.method}</InfoItem>
          </Section>
        )}

        {/* Sản phẩm */}
        <Section>
          <SectionHeader>Sản phẩm trong đơn</SectionHeader>
          <ProductsGrid>
            {order.items.map((item, idx) => (
              <ProductCard key={idx}>
                <ProductImg src={item.images?.[0] || '/images/placeholder.jpg'} alt={item.name} />
                <ProductName>{item.name}</ProductName>
                <ProductQty>Số lượng: {item.quantity}</ProductQty>
              </ProductCard>
            ))}
          </ProductsGrid>
        </Section>
             <BackButton onClick={() => navigate('/admin/orders')}>← Quay lại danh sách đơn</BackButton>
      </Container>
    </Wrapper>
  );
}
