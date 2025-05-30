import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, ListGroup, Spinner, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const BACKEND_URL = 'http://localhost:9999';

const OrderHistory = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const userId = localStorage.getItem('id');

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await axios.get(`${BACKEND_URL}/orders/customer/${userId}`);
				setOrders(res.data);
			} catch (err) {
				console.error(err);
				toast.error('Không thể tải lịch sử đơn hàng');
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [userId]);

	if (loading) {
		return (
			<Container className='pt-5 text-center'>
				<Spinner animation='border' />
			</Container>
		);
	}

	if (!orders.length) {
		return (
			<Container
				className='pt-5 text-center'
				style={{ marginTop: '200px', marginBottom: '100px' }}>
				<h4>Bạn chưa có đơn hàng nào</h4>
			</Container>
		);
	}

	const translateStatus = (status) => {
		switch (status) {
			case 'PENDING':
				return 'Chờ xác nhận';
			case 'CONFIRMED':
				return 'Đã xác nhận';
			case 'SHIPPED':
				return 'Đang giao';
			case 'DELIVERED':
				return 'Đã giao';
			case 'CANCELLED':
				return 'Đã hủy';
			default:
				return status;
		}
	};

	return (
		<Container className='pt-5' style={{ marginTop: '200px' }}>
			<h2 className='mb-4' style={{ fontWeight: 'bold' }} >Lịch sử đơn hàng</h2>
			{orders.map((order) => (
				<Card key={order._id} className='mb-4'>
					<Card.Header>
						<strong>Đơn #{order._id.slice(-6).toUpperCase()}</strong> —{' '}
						<span className='text-muted'>
							{new Date(order.createdAt).toLocaleString()}
						</span>
						<Button
							className='float-end'
							variant='outline-success'
							size='sm'
							href={`/my-orders/${order._id}`}>
							Xem chi tiết
						</Button>
					</Card.Header>
					<ListGroup variant='flush'>
						{order.items.map((item, idx) => (
							<ListGroup.Item key={idx}>
								<div className='d-flex align-items-center'>
									{item.productId?.images?.[0] && (
										<img
											src={`${BACKEND_URL}${item.productId.images[0]}`}
											alt={item.name}
											style={{
												width: '60px',
												height: '60px',
												objectFit: 'cover',
												borderRadius: '8px',
												marginRight: '12px',
											}}
											onError={(e) => {
												e.target.onerror = null;
												e.target.src = '/images/placeholder.jpg';
											}}
										/>
									)}
									<div>
										<div>
											{item.name} × {item.quantity}
										</div>
										<div className='text-muted'>
											{item.price.toLocaleString()} VND
										</div>
									</div>
								</div>
							</ListGroup.Item>
						))}
						<ListGroup.Item>
							<strong>Tổng tiền:</strong> {order.total.toLocaleString()} VND
						</ListGroup.Item>
						<ListGroup.Item>
							<strong>Phương thức thanh toán:</strong>{' '}
							{order.paymentInfo.method.toUpperCase()}
						</ListGroup.Item>
						<ListGroup.Item>
							<strong>Trạng thái:</strong> {translateStatus(order.status)}
						</ListGroup.Item>
					</ListGroup>
				</Card>
			))}
		</Container>
	);
};

export default OrderHistory;
