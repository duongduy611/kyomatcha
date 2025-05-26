import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
	Container,
	Row,
	Col,
	Card,
	Button,
	Image,
	Form,
	ListGroup,
} from 'react-bootstrap';

const MyCart = () => {
	const [cart, setCart] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState('');

	const userId = localStorage.getItem('id');
	const BACKEND_URL = 'http://localhost:9999';

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const res = await axios.get(`${BACKEND_URL}/cart/${userId}`);
				setCart(res.data);
			} catch {
				setError('Lỗi khi tải giỏ hàng');
			} finally {
				setLoading(false);
			}
		};
		fetchCart();
	}, [userId]);

	const handleDecrease = async (productId, color, size) => {
		try {
			const res = await axios.post(`${BACKEND_URL}/cart/decrease`, {
				userId,
				productId,
				color,
				size,
			});
			setCart(res.data);
			toast.info('Đã giảm số lượng');
		} catch {
			toast.error('Lỗi khi giảm số lượng');
		}
	};

	const handleIncrease = async (productId, color, size) => {
		try {
			const res = await axios.post(`${BACKEND_URL}/cart/increase`, {
				userId,
				productId,
				color,
				size,
			});
			setCart(res.data);
			toast.success('Đã tăng số lượng');
		} catch {
			toast.error('Lỗi khi tăng số lượng');
		}
	};

	const handleRemove = async (productId, color, size) => {
		try {
			const res = await axios.post(`${BACKEND_URL}/cart/remove`, {
				userId,
				productId,
				color,
				size,
			});
			setCart(res.data);
			toast.info('Đã xoá sản phẩm khỏi giỏ');
		} catch {
			toast.error('Lỗi khi xoá sản phẩm');
		}
	};

	const handleCheckout = () => {
		if (paymentMethod === 'cod') {
			toast.success('Đặt hàng thành công! Đang xử lý đơn hàng.');
		} else if (paymentMethod === 'zalopay') {
			window.location.href = `${BACKEND_URL}/payment/zalopay/redirect?userId=${userId}`;
		}
	};

	if (loading)
		return <div className='pt-5 text-center'>Đang tải giỏ hàng...</div>;
	if (error) return <div className='pt-5 text-center text-danger'>{error}</div>;
	if (!cart || cart.items.length === 0)
		return <div className='pt-5 text-center'>Giỏ hàng trống</div>;

	const totalPrice = cart.items.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);
	console.log(cart.items[0].image);

	return (
		<Container style={{ marginTop: '200px' }} className='pb-5'>
			<h2 className='mb-4'>🛒 Giỏ hàng của bạn</h2>
			<Row>
				<Col md={8}>
					<Card
						className='mb-4'
						style={{ borderRadius: '16px', backgroundColor: '#ffffff' }}>
						<ListGroup variant='flush'>
							{cart.items.map((item) => (
								<ListGroup.Item
									key={item._id}
									style={{ borderBottom: '1px solid #eee', padding: '20px' }}>
									<Row className='align-items-center'>
										<Col md={2}>
											<Image
												src={`${item.image}`}
												fluid
												rounded
												style={{ borderRadius: '10px' }}
											/>
										</Col>
										<Col md={4}>
											<h5 style={{ fontWeight: 600 }}>{item.name}</h5>
											<p className='mb-1'>
												Màu: <strong>{item.color}</strong>
											</p>
											<p>
												Kích cỡ: <strong>{item.size}</strong>
											</p>
										</Col>
										<Col md={3}>
											<div className='d-flex align-items-center justify-content-start'>
												<Button
													variant='outline-success'
													size='sm'
													style={{ borderRadius: '8px' }}
													onClick={() =>
														handleDecrease(
															item.productId,
															item.color,
															item.size
														)
													}>
													−
												</Button>
												<span className='mx-2'>{item.quantity}</span>
												<Button
													variant='outline-success'
													size='sm'
													style={{ borderRadius: '8px' }}
													onClick={() =>
														handleIncrease(
															item.productId,
															item.color,
															item.size
														)
													}>
													+
												</Button>
											</div>
										</Col>
										<Col md={2}>
											<div style={{ fontWeight: 600, color: '#33691e' }}>
												{item.price.toLocaleString()} VND
											</div>
										</Col>
										<Col md={1}>
											<Button
												variant='outline-danger'
												size='sm'
												style={{
													fontSize: '0.8rem',
													borderRadius: '8px',
													padding: '5px 10px',
												}}
												onClick={() =>
													handleRemove(item.productId, item.color, item.size)
												}>
												Xóa
											</Button>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					</Card>

					<Button href='/products' variant='success'>
						← Tiếp tục mua sắm
					</Button>
				</Col>
				<Col md={4}>
					<Card style={{ backgroundColor: '#f9fbe7', borderRadius: '16px' }}>
						<Card.Body>
							<h5 className='mb-3' style={{ color: '#33691e' }}>
								🧾 Tổng cộng
							</h5>
							<p style={{ fontSize: '1.1rem' }}>
								Tổng tiền:{' '}
								<strong style={{ color: '#1b5e20' }}>
									{totalPrice.toLocaleString()} VND
								</strong>
							</p>

							<Form>
								<Form.Group>
									<Form.Label style={{ fontWeight: '500' }}>
										Phương thức thanh toán:
									</Form.Label>
									<div className='mb-3'>
										<Form.Check
											type='radio'
											id='cod'
											name='paymentMethod'
											label='📦 Thanh toán khi nhận hàng (COD)'
											value='cod'
											checked={paymentMethod === 'cod'}
											onChange={(e) => setPaymentMethod(e.target.value)}
										/>
										<Form.Check
											type='radio'
											id='zalopay'
											name='paymentMethod'
											value='zalopay'
											checked={paymentMethod === 'zalopay'}
											onChange={(e) => setPaymentMethod(e.target.value)}
											label={
												<span>
													<img
														src='https://img.icons8.com/color/48/zalo.png'
														alt='ZaloPay'
														style={{ height: '24px', marginRight: '8px' }}
													/>
													Thanh toán qua ZaloPay
												</span>
											}
										/>
									</div>
								</Form.Group>

								<Button
									variant='success'
									onClick={handleCheckout}
									disabled={!paymentMethod}
									className='w-100'
									style={{
										backgroundColor: '#8bc34a',
										border: 'none',
										borderRadius: '12px',
										padding: '10px',
										fontWeight: 'bold',
									}}>
									{paymentMethod === 'zalopay'
										? 'Thanh toán với ZaloPay'
										: 'Xác nhận đặt hàng'}
								</Button>
							</Form>
						</Card.Body>
					</Card>

					<Card
						className='mt-3'
						style={{ backgroundColor: '#f1f8e9', borderRadius: '16px' }}>
						<Card.Body>
							<Form>
								<Form.Group controlId='couponCode'>
									<Form.Label style={{ fontWeight: 500 }}>
										🎁 Mã giảm giá
									</Form.Label>
									<div className='d-flex'>
										<Form.Control type='text' placeholder='Nhập mã...' />
										<Button variant='outline-success' className='ms-2'>
											Áp dụng
										</Button>
									</div>
								</Form.Group>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default MyCart;
