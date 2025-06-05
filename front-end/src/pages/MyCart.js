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

	const userId = localStorage.getItem('id');
	const navigate = useNavigate();
	const BACKEND_URL = 'http://localhost:9999';

	useEffect(() => {
		const fetchProvinces = async () => {
			const res = await axios.get('https://provinces.open-api.vn/api/p/');
			setProvinces(res.data.map((p) => ({ label: p.name, value: p.code })));
		};
		fetchProvinces();
	}, []);

	useEffect(() => {
		if (selectedProvince) {
			axios
				.get(
					`https://provinces.open-api.vn/api/p/${selectedProvince.value}?depth=2`
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
					`https://provinces.open-api.vn/api/d/${selectedDistrict.value}?depth=2`
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

const handleCheckout = async () => {
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

	const fullAddress = [
		address?.trim(),
		selectedWard?.label,
		selectedDistrict?.label,
		selectedProvince?.label,
	]
		.filter(Boolean)
		.join(', ');

	try {
		// Bước 1: Tạo đơn hàng trước
		const orderRes = await axios.post(`${BACKEND_URL}/orders`, {
			userId,
			items: cart.items.map((item) => ({
				productId: item.productId,
				name: item.name,
				quantity: item.quantity,
				price: item.price,
			})),
			total: totalPrice,
			shippingInfo: {
				address: fullAddress,
				receiverName,
				phone,
			},
			paymentInfo: { method: paymentMethod },
		});

		const createdOrder = orderRes.data;

		if (paymentMethod === 'VietQR') {
			// Bước 2: Gọi API VietQR để lấy mã QR
			const qrRes = await axios.post(`${BACKEND_URL}/vietqr/create`, {
				orderId: createdOrder._id,
			});

			// Bước 3: Điều hướng tới trang hiển thị mã QR (tạo mới nếu chưa có)
			if (qrRes.data?.qrBase64) {
				// lưu tạm orderId vào localStorage hoặc dùng redirect có query param
				localStorage.setItem('qrCheckout', JSON.stringify(qrRes.data));
				navigate('/qr-payment');
			} else {
				toast.error('Không thể tạo mã QR thanh toán');
			}
		} else {
			// Xử lý COD như bình thường
			await axios.delete(`${BACKEND_URL}/cart/clear/${userId}`);
			setCart({ items: [] });
			toast.success('Đặt hàng thành công!');
			navigate('/thankyou'); 
		}
	} catch (err) {
		console.error(err);
		toast.error('Lỗi khi xử lý thanh toán');
	}
};

	if (loading)
		return <div className='pt-5 text-center' style={{ marginTop: '200px', marginBottom: '100px' }}>Đang tải giỏ hàng...</div>;
	if (error) return <div className='pt-5 text-center text-danger'>{error}</div>;
	if (!cart || cart.items.length === 0)
		return <div className='pt-5 text-center'  style={{ marginTop: '200px', marginBottom: '100px' }}>Giỏ hàng trống</div>;

	const totalPrice = cart.items.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);
	console.log(cart.items[0].image);

	return (
		<Container style={{ marginTop: '200px'}} className='pb-5'>
			<h2 className='mb-3' style={{ color: '#33691e' , fontStyle: 'bold'}}>
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

			<h2 className='mb-4' > Giỏ hàng của bạn</h2>
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
												src={`${BACKEND_URL}${item.image}`}
												alt={item.name}
												fluid
												rounded
												style={{ borderRadius: '10px' }}
												onError={(e) => {
													e.target.onerror = null;
													e.target.src = '/images/placeholder.jpg'; // fallback local in public/images
												}}
											/>
										</Col>
										<Col md={4}>
											<h5 style={{ fontWeight: 600 }}>{item.name}</h5>

											{item.color ? (
												<p className='mb-1'>
													Màu: <strong>{item.color}</strong>
												</p>
											) : (
												<p className='mb-1 text-muted'>
													<em>Không có màu</em>
												</p>
											)}

											{item.size ? (
												<p>
													Kích cỡ: <strong>{item.size}</strong>
												</p>
											) : (
												<p className='text-muted'>
													<em>Không có kích cỡ</em>
												</p>
											)}
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
							<h5 className='mb-3' style={{ color: '#33691e', fontWeight: 'bold' }}>
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
											label={
												<span>
													Thanh toán qua VietQR
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
