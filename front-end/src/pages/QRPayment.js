import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

const QRPaymentPage = () => {
	const navigate = useNavigate();
	const [cart, setCart] = useState({ items: [] });
	const userId = localStorage.getItem('userId');
	const [qrData, setQrData] = useState(null);
	const [loading, setLoading] = useState(true);
	const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

	useEffect(() => {
		const stored = localStorage.getItem('qrCheckout');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				setQrData(parsed);
			} catch (err) {
				console.error('Lỗi parse QR data:', err);
			}
		}
		setLoading(false);
	}, []);

	const handleConfirmPayment = async () => {
		try {
			const res = await axios.post(`${BACKEND_URL}/orders/confirm-payment`, {
				orderId: qrData.orderId,
			});

			toast.success('Đã xác nhận và gửi hóa đơn qua email');
			localStorage.removeItem('qrCheckout');
			await axios.delete(`${BACKEND_URL}/cart/clear/${userId}`);
			setCart({ items: [] });
			navigate('/thankyou');
		} catch (error) {
			console.error('Lỗi xác nhận thanh toán:', error);
			toast.error('Gửi hóa đơn thất bại. Vui lòng thử lại.');
		}
	};

	return (
		<Container
			className='pt-5'
			style={{ marginTop: '150px', marginBottom: '100px' }}>
			<Card className='p-4 text-center'>
				<h3 className='mb-3'>Thanh toán qua VietQR</h3>

				{loading ? (
					<Spinner animation='border' />
				) : qrData ? (
					<>
						<p>
							Vui lòng quét mã QR để thanh toán đơn hàng #
							{qrData.orderId.slice(-6).toUpperCase()}
						</p>
						<img
							src={qrData.qrBase64}
							alt='QR Code VietQR'
							style={{
								maxWidth: 280,
								margin: '0 auto',
								border: '1px solid #ccc',
							}}
						/>
						<p className='mt-3'>
							<Row>
								<Col className='d-flex justify-content-end'>
									<strong>Số tiền:</strong>{' '}
								</Col>
								<Col className='d-flex justify-content-start'>
									<div>{qrData.amount.toLocaleString()} VND</div>{' '}
								</Col>
							</Row>

							<Row>
								<Col className='d-flex justify-content-end'>
									<strong>Người nhận:</strong>{' '}
								</Col>
								<Col className='d-flex justify-content-start'>
									<div>DUONG VIET DUY</div>{' '}
								</Col>
							</Row>

							<Row>
								<Col className='d-flex justify-content-end'>
									<strong>Tài khoản nhận:</strong>{' '}
								</Col>
								<Col className='d-flex justify-content-start'>
									<div>80001118546</div>{' '}
								</Col>
							</Row>
						</p>
						<Button
							variant='success'
							className='mt-3'
							onClick={handleConfirmPayment}>
							Tôi đã thanh toán
						</Button>
					</>
				) : (
					<p className='text-danger'>Không thể hiển thị mã QR.</p>
				)}
			</Card>
		</Container>
	);
};

export default QRPaymentPage;
