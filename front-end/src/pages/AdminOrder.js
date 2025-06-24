import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const SORT_OPTIONS = [
  { label: 'Giá tăng dần', value: 'ASC' },
  { label: 'Giá giảm dần', value: 'DESC' },
];

// Styled components
const Wrapper = styled.div`
  min-height: 100vh;
  background: #fcf9f2;
  padding: 120px 0 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #231b10;
  margin-bottom: 16px;
  letter-spacing: 1px;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  flex: 1;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #231b10;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #6a6649;
  font-size: 1rem;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  margin-top: 24px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

const OrderCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

const StatusSelect = styled.select`
  font-weight: 600;
  color: #527328;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
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
`;

const ProductName = styled.div`
  font-size: 1rem;
  color: #231b10;
`;

const ProductQty = styled.div`
  font-size: 0.95rem;
  color: #bfa76a;
`;

const OrderTotal = styled.div`
  font-weight: 600;
  color: #6a6649;
  margin-top: 12px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const DetailButton = styled.button`
  background: none;
  border: none;
  color: #bfa76a;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background: #e74c3c;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
`;

// Helper to translate status
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

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortDir, setSortDir] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Compute statistics
  const totalOrders = orders.length;
  const deliveredRevenue = orders
    .filter(o => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.total, 0);
  const estimatedRevenue = orders
    .filter(o => o.status === 'CONFIRMED')
    .reduce((sum, o) => sum + o.total, 0);

  const chartData = [
    { name: 'Đã giao', revenue: deliveredRevenue },
    { name: 'Đã xác nhận', revenue: estimatedRevenue }
  ];

  // Time series per day
  const timeSeriesData = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      const date = new Date(o.createdAt).toLocaleDateString('en-GB');
      if (!map[date]) map[date] = { date, delivered: 0, confirmed: 0 };
      if (o.status === 'DELIVERED') map[date].delivered += o.total;
      if (o.status === 'CONFIRMED') map[date].confirmed += o.total;
    });
    return Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [orders]);

  // Filtered and sorted orders
  const displayedOrders = useMemo(() => {
    let list = [...orders];
    if (searchTerm) {
      list = list.filter(o => o._id.includes(searchTerm));
    }
    if (filterStatus !== 'ALL') {
      list = list.filter(o => o.status === filterStatus);
    }
    if (sortDir === 'ASC') {
      list.sort((a, b) => a.total - b.total);
    } else if (sortDir === 'DESC') {
      list.sort((a, b) => b.total - a.total);
    }
    return list;
  }, [orders, searchTerm, filterStatus, sortDir]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `${BACKEND_URL}/admin/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev => prev.map(o => o._id === orderId ? res.data.order : o));
      toast.success('Cập nhật trạng thái thành công');
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.filter(o => o._id !== orderId));
      toast.success('Xóa đơn hàng thành công');
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <Container>
          <Title>Đang tải...</Title>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <Title>Quản lý Đơn hàng</Title>
        {/* Statistics */}
        <StatsContainer>
          <StatCard>
            <StatNumber>{totalOrders}</StatNumber>
            <StatLabel>Tổng đơn hàng</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{deliveredRevenue.toLocaleString()}₫</StatNumber>
            <StatLabel>Doanh thu đã giao</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{estimatedRevenue.toLocaleString()}₫</StatNumber>
            <StatLabel>Doanh thu dự kiến</StatLabel>
          </StatCard>
        </StatsContainer>

        {/* Aggregated bar chart */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={value => new Intl.NumberFormat('vi-VN').format(value) + '₫'} />
            <Bar dataKey="revenue" fill="#527328" />
          </BarChart>
        </ResponsiveContainer>

        {/* Time series line chart */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={value => new Intl.NumberFormat('vi-VN').format(value) + '₫'} />
            <Line type="monotone" dataKey="delivered" name="Đã giao" stroke="#527328" />
            <Line type="monotone" dataKey="confirmed" name="Đã xác nhận" stroke="#bfa76a" />
          </LineChart>
        </ResponsiveContainer>

        {/* Controls */}
        <Controls >
          <SearchInput
            placeholder="Tìm kiếm theo ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <FilterSelect value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {STATUS_OPTIONS.map(st => (
              <option key={st} value={st}>
                {st === 'ALL' ? 'Tất cả' : translateStatus(st)}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect value={sortDir || ''} onChange={e => setSortDir(e.target.value || null)}>
            <option value="">Mặc định</option>
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FilterSelect>
        </Controls>

        {/* Orders list */}
        {displayedOrders.length === 0 ? (
          <div style={{ color: '#bfa76a', fontStyle: 'italic' }}>Không có đơn hàng</div>
        ) : (
          displayedOrders.map(order => (
            <OrderCard key={order._id}>
              <OrderHeader>
                <OrderId>#{order._id.slice(-6).toUpperCase()}</OrderId>
                <OrderDate>{new Date(order.createdAt).toLocaleString()}</OrderDate>
                <StatusSelect
                  value={order.status}
                  onChange={e => handleStatusChange(order._id, e.target.value)}
                >
                  {STATUS_OPTIONS.filter(s => s !== 'ALL').map(st => (
                    <option key={st} value={st}>
                      {translateStatus(st)}
                    </option>
                  ))}
                </StatusSelect>
              </OrderHeader>

              <OrderProducts>
                {order.items.map((item, idx) => (
                  <ProductItem key={idx}>
                    <ProductImg
                      src={item.images?.[0] || '/images/placeholder.jpg'}
                      alt={item.name}
                    />
                    <div>
                      <ProductName>{item.name}</ProductName>
                      <ProductQty>×{item.quantity}</ProductQty>
                    </div>
                  </ProductItem>
                ))}
              </OrderProducts>

              <OrderTotal>Tổng: {order.total.toLocaleString()}₫</OrderTotal>
              <Actions>
                <DetailButton onClick={() => navigate(`/admin/orders/${order._id}`)}>
                  Xem chi tiết
                </DetailButton>
                <DeleteButton onClick={() => handleDelete(order._id)}>
                  Xóa hóa đơn
                </DeleteButton>
              </Actions>
            </OrderCard>
          ))
        )}
      </Container>
    </Wrapper>
  );
}
