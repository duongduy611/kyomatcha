import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner } from 'react-bootstrap';

const QRPaymentPage = () => {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <Container className="pt-5" style={{ marginTop: '150px', marginBottom: '100px' }}>
      <Card className="p-4 text-center">
        <h3 className="mb-3">Thanh toán qua VietQR</h3>

        {loading ? (
          <Spinner animation="border" />
        ) : qrData ? (
          <>
            <p>Vui lòng quét mã QR để thanh toán đơn hàng #{qrData.orderId.slice(-6).toUpperCase()}</p>
            <img
              src={qrData.qrBase64}
              alt="QR Code VietQR"
              style={{ maxWidth: 280, margin: '0 auto', border: '1px solid #ccc' }}
            />
            <p className="mt-3">
              <strong>Số tiền:</strong> {qrData.amount.toLocaleString()} VND
            </p>
            <Button
              variant="success"
              className="mt-3"
              onClick={() => {
                localStorage.removeItem('qrCheckout');
                navigate('/thankyou');
              }}
            >
              Tôi đã thanh toán
            </Button>
          </>
        ) : (
          <p className="text-danger">Không thể hiển thị mã QR.</p>
        )}
      </Card>
    </Container>
  );
};

export default QRPaymentPage;
