import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <Container className="text-center py-5" style={{ minHeight: '60vh',marginTop: 200}}>
      <h2 className="mb-4">Cảm ơn bạn đã đặt hàng!</h2>
      <p>Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất.</p>
      <Link to="/products">
        <Button variant="success" className="mt-4">Tiếp tục mua sắm</Button>
      </Link>
    </Container>
  );
};

export default ThankYouPage;
