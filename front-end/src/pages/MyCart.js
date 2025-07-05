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
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../utils';

const MyCart = () => {
	const [cart, setCart] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState('');
	const [receiverName, setReceiverName] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [provinces, setProvinces] = useState([]);
	const [districts, setDistricts] = useState([]);
	const [wards, setWards] = useState([]);

	const [selectedProvince, setSelectedProvince] = useState(null);
	const [selectedDistrict, setSelectedDistrict] = useState(null);
	const [selectedWard, setSelectedWard] = useState(null);

	const userId = localStorage.getItem('userId');
	const navigate = useNavigate();
	const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

	useEffect(() => {
		const fetchProvinces = async () => {
			const res = await axios.get('http://provinces.open-api.vn/api/p/');
			setProvinces(res.data.map((p) => ({ label: p.name, value: p.code })));
		};
		fetchProvinces();
	}, []);

	useEffect(() => {
		if (selectedProvince) {
			axios
				.get(
					`http://provinces.open-api.vn/api/p/${selectedProvince.value}?depth=2`
				)
				.then((res) => {
					setDistricts(
						res.data.districts.map((d) => ({ label: d.name, value: d.code }))
					);
					setWards([]);
					setSelectedDistrict(null);
					setSelectedWard(null);
				});
		}
	}, [selectedProvince]);

	useEffect(() => {
		if (selectedDistrict) {
			axios
				.get(
					`http://provinces.open-api.vn/api/d/${selectedDistrict.value}?depth=2`
				)
				.then((res) => {
					setWards(
						res.data.wards.map((w) => ({ label: w.name, value: w.code }))
					);
					setSelectedWard(null);
				});
		}
	}, [selectedDistrict]);

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

	const handleDecrease = async (item) => {
		try {
			// build payload tùy theo item là combo hay product
			const payload = item.comboTitle
				? {
						userId,
						comboId: item.productId,
						matchaTitle: item.variant?.title || item.title,
				  }
				: {
						userId,
						productId: item.productId,
						color: item.color,
						size: item.size,
				  };

			const res = await axios.post(`${BACKEND_URL}/cart/decrease`, payload);
			setCart(res.data);
			toast.info('Đã giảm số lượng');
		} catch {
			toast.error('Lỗi khi giảm số lượng');
		}
	};

	const handleIncrease = async (item) => {
		try {
			const payload = item.comboTitle
				? {
						userId,
						comboId: item.productId,
						matchaTitle: item.variant?.title || item.title,
				  }
				: {
						userId,
						productId: item.productId,
						color: item.color,
						size: item.size,
				  };

			const res = await axios.post(`${BACKEND_URL}/cart/increase`, payload);
			setCart(res.data);
			toast.success('Đã tăng số lượng');
		} catch {
			toast.error('Lỗi khi tăng số lượng');
		}
	};

	const handleRemove = async (item) => {
		try {
			const payload = item.comboTitle
				? {
						userId,
						comboId: item.productId,
						matchaTitle: item.variant?.title || item.title,
				  }
				: {
						userId,
						productId: item.productId,
						color: item.color,
						size: item.size,
				  };

			const res = await axios.post(`${BACKEND_URL}/cart/remove`, payload);
			setCart(res.data);
			toast.info('Đã xoá sản phẩm khỏi giỏ');
		} catch {
			toast.error('Lỗi khi xoá sản phẩm');
		}
	};

	const handleCheckout = async () => {
		// 0️⃣ Validate thông tin giao hàng
		if (
			!receiverName ||
			!phone ||
			!address ||
			!selectedProvince ||
			!selectedDistrict ||
			!selectedWard
		) {
			toast.warning('Vui lòng nhập đầy đủ thông tin giao hàng');
			return;
		}

		// 1️⃣ Xây dựng fullAddress
		const fullAddress = [
			address.trim(),
			selectedWard.label,
			selectedDistrict.label,
			selectedProvince.label,
		]
			.filter(Boolean)
			.join(', ');

		// 2️⃣ Build mảng items đúng format
		const orderItems = cart.items.map((item) => {
			// Nếu là combo (đã enrich comboTitle và variant)
			if (item.comboTitle) {
				return {
					comboId: item.productId,
					matchaTitle: item.variant?.title || item.title,
					price: item.price,
					quantity: item.quantity,
				};
			}
			// Ngược lại là product
			return {
				productId: item.productId,
				name: item.name,
				color: item.color,
				size: item.size,
				price: item.price,
				quantity: item.quantity,
			};
		});

		try {
			// 3️⃣ Gọi POST tạo order
			const orderRes = await axios.post(
				`${BACKEND_URL}/orders`,
				{
					userId,
					items: orderItems,
					total: totalPrice,
					shippingInfo: {
						address: fullAddress,
						receiverName,
						phone,
					},
					paymentInfo: { method: paymentMethod },
				},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				}
			);

			const createdOrder = orderRes.data;
			console.log(createdOrder._id);
			
			// 4️⃣ Xử lý theo phương thức thanh toán
			if (paymentMethod === 'VietQR') {
				const qrRes = await axios.post(
					`${BACKEND_URL}/vietqr/create`,
					{ orderId: createdOrder._id },
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}
				);
				if (qrRes.data?.qrBase64) {
					localStorage.setItem('qrCheckout', JSON.stringify(qrRes.data));
					navigate('/qr-payment');
				} else {
					toast.error('Không thể tạo mã QR thanh toán');
				}
			} else {
				// COD
				await axios.delete(`${BACKEND_URL}/cart/clear/${userId}`);
				setCart({ items: [] });
				await axios.post(
					`${BACKEND_URL}/orders/confirm-payment`,
					{ orderId: createdOrder._id },
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					}
				);
				toast.success('Đặt hàng thành công!');
				navigate('/thankyou');
			}
		} catch (err) {
			console.error(err);
			toast.error(err.response?.data?.message || 'Lỗi khi xử lý thanh toán');
		}
	};

	if (loading)
		return (
			<div
				className='pt-5 text-center'
				style={{ marginTop: '200px', marginBottom: '100px' }}>
				Đang tải giỏ hàng...
			</div>
		);
	if (error) return <div className='pt-5 text-center text-danger'>{error}</div>;
	if (!cart || cart.items.length === 0)
		return (
			<div
				className='pt-5 text-center'
				style={{ marginTop: '200px', marginBottom: '100px' }}>
				Giỏ hàng trống
			</div>
		);

	const totalPrice = cart.items.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);
	console.log(cart.items[0].image);

	return (
		<Container style={{ marginTop: '200px' }} className='pb-5'>
			<h2 className='mb-3' style={{ color: '#33691e', fontStyle: 'bold' }}>
				Thông tin giao hàng
			</h2>
			<Row>
				<Col md={6}>
					<Form.Group className='mb-2'>
						<Form.Label>Họ tên người nhận</Form.Label>
						<Form.Control
							type='text'
							value={receiverName}
							onChange={(e) => setReceiverName(e.target.value)}
							placeholder='Nhập họ tên'
						/>
					</Form.Group>

					<Form.Group className='mb-2'>
						<Form.Label>Số điện thoại</Form.Label>
						<Form.Control
							type='text'
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder='Nhập số điện thoại'
						/>
					</Form.Group>

					<Form.Group className='mb-2'>
						<Form.Label>Tỉnh / Thành phố</Form.Label>
						<Select
							options={provinces}
							value={selectedProvince}
							onChange={setSelectedProvince}
							placeholder='Chọn tỉnh'
						/>
					</Form.Group>
				</Col>
				<Col md={6}>
					<Form.Group className='mb-2'>
						<Form.Label>Quận / Huyện</Form.Label>
						<Select
							options={districts}
							value={selectedDistrict}
							onChange={setSelectedDistrict}
							placeholder='Chọn huyện'
							isDisabled={!selectedProvince}
						/>
					</Form.Group>

					<Form.Group className='mb-2'>
						<Form.Label>Phường / Xã</Form.Label>
						<Select
							options={wards}
							value={selectedWard}
							onChange={setSelectedWard}
							placeholder='Chọn phường'
							isDisabled={!selectedDistrict}
						/>
					</Form.Group>

					<Form.Group className='mb-4'>
						<Form.Label>Địa chỉ chi tiết</Form.Label>
						<Form.Control
							type='text'
							rows={2}
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							placeholder='Nhập địa chỉ nhận hàng'
						/>
					</Form.Group>
				</Col>
			</Row>

			<h2 className='mb-4'> Giỏ hàng của bạn</h2>
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
												src={resolveImageUrl(item.image)}
												alt={item.name}
												fluid
												rounded
												style={{ borderRadius: '10px' }}
												onError={(e) => {
													e.currentTarget.onerror = null;
													e.currentTarget.src = '/images/placeholder.jpg';
												}}
											/>
										</Col>
										<Col md={4}>
											{/* Nếu là combo, render comboTitle + variant, ngược lại render name */}
											{item.comboTitle ? (
												<>
													<h5 style={{ fontWeight: 600 }}>{item.comboTitle}</h5>
													{item.variant && (
														<div
															style={{
																fontSize: '0.95rem',
																marginTop: '4px',
																color: '#555',
															}}>
															{item.variant.title} —{' '}
															{item.variant.price.toLocaleString()}đ
														</div>
													)}
												</>
											) : (
												<h5 style={{ fontWeight: 600 }}>{item.name}</h5>
											)}
										</Col>
										<Col md={3}>
											<div className='d-flex align-items-center justify-content-start'>
												<Button
													variant='outline-success'
													size='sm'
													style={{ borderRadius: '8px' }}
													onClick={() => handleDecrease(item)}>
													−
												</Button>
												<span className='mx-2'>{item.quantity}</span>
												<Button
													variant='outline-success'
													size='sm'
													style={{ borderRadius: '8px' }}
													onClick={() => handleIncrease(item)}>
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
												onClick={() => handleRemove(item)}>
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
							<h5
								className='mb-3'
								style={{ color: '#33691e', fontWeight: 'bold' }}>
								Tổng cộng
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
											id='COD'
											name='paymentMethod'
											label='Thanh toán khi nhận hàng (COD)'
											value='COD'
											checked={paymentMethod === 'COD'}
											onChange={(e) => setPaymentMethod(e.target.value)}
										/>
										<Form.Check
											type='radio'
											id='VietQR'
											name='paymentMethod'
											value='VietQR'
											checked={paymentMethod === 'VietQR'}
											onChange={(e) => setPaymentMethod(e.target.value)}
											label={<span>Thanh toán qua VietQR</span>}
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
									<Form.Label style={{ fontWeight: 500, fontStyle: 'bold' }}>
										Mã giảm giá
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
