import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
	Container,
	Spinner,
	Card,
	Button,
	Row,
	Col,
} from 'react-bootstrap';
import OrderProgressBar from '../components/OrderProgressBar';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const OrderDetail = () => {
	const { orderId } = useParams();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const res = await axios.get(`${BACKEND_URL}/orders/${orderId}`);
				setOrder(res.data);
			} catch (err) {
				console.error('Lỗi khi tải đơn hàng:', err);
			} finally {
				setLoading(false);
			}
		};
		fetchOrder();
	}, [orderId]);

	if (loading) {
		return (
			<Container className='pt-5 text-center'>
				<Spinner />
			</Container>
		);
	}

	if (!order) {
		return (
			<Container
				className='pt-5 text-center'
				style={{ marginTop: '200px', marginBottom: '100px' }}>
				Không tìm thấy đơn hàng
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
		<Container
			className='pt-5'
			style={{ marginTop: '150px', marginBottom: '100px' }}>
			<h4 className='mb-4' style={{ color: '#6b4f2d', fontWeight: 'bold' }}>
				<i
					className='bi bi-box-seam-fill me-2'
					style={{ color: '#b0884d' }}></i>
				Theo dõi đơn hàng
			</h4>

			<Card className='p-4 shadow-sm rounded-4'>
				{/* THÔNG TIN ĐƠN */}
				<Row>
					<Col md={6}>
						<p>
							<strong>Order ID:</strong> {order._id}
						</p>
						<p>
							<strong>Ngày đặt:</strong>{' '}
							{new Date(order.createdAt).toLocaleString()}
						</p>
                        <p>
						<strong>Địa chỉ:</strong> {order.shippingInfo.address}
					</p>
					</Col>
					<Col md={6}>
						<p>
							<strong>Trạng thái:</strong> {translateStatus(order.status)}
						</p>
						<p>
							<strong>Người nhận:</strong> {order.shippingInfo.receiverName} —{' '}
							{order.shippingInfo.phone}
						</p>
                        <p>
							<strong>Thanh toán bằng:</strong> {order.paymentInfo.method}
						</p>
					</Col>
					
				</Row>

			
                <OrderProgressBar status={order.status} />


				{/* SẢN PHẨM */}
				<Row className='mt-4'>
					{order.items.map((item, idx) => (
						<Col md={3} sm={6} xs={12} key={idx} className='text-center mb-4'>
							<img
								src={`http://localhost:9999${item.productId?.images?.[0]}`}
								alt={item.name}
								className='img-fluid mb-2'
								style={{ height: '100px', objectFit: 'contain' }}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = '/images/placeholder.jpg';
								}}
							/>
							<div>{item.name}</div>
							<div className='text-muted' style={{ fontSize: '0.9rem' }}>
								SL: {item.quantity} – {item.price.toLocaleString()} VND
							</div>
						</Col>
					))}
				</Row>

				{/* NÚT */}
				<div className='text-end mt-3'>
					<Button variant='outline-secondary' href='/profile'>
						← Trở về lịch sử đơn hàng
					</Button>
				</div>
			</Card>
		</Container>
	);
};

export default OrderDetail;
