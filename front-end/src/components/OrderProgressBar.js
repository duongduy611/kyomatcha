import React from 'react';
import '../assets/css/orders/OrderProgress.css';

const statusSteps = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const statusLabels = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Xác nhận đơn hàng',
  SHIPPED: 'Trên đường giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã huỷ đơn',
};

const getCurrentStepIndex = (status) => {
  const idx = statusSteps.indexOf(status);
  return idx >= 0 ? idx : 0;
};

const OrderProgressBar = ({ status }) => {
  const currentIndex = getCurrentStepIndex(status);
  const stepCount = statusSteps.length;

  return (
    <div className="position-relative">
      <div className="order-progress">
        <div
          className="order-progress-fill"
          style={{
            width: `${(currentIndex / (stepCount - 1)) * 100}%`,
            right: `${100 - (currentIndex / (stepCount - 1)) * 100}%`,
          }}
        ></div>

        {statusSteps.map((s, idx) => (
          <div
            key={s}
            className={`order-step ${idx <= currentIndex ? 'active' : ''}`}
          >
            <div className="circle"></div>
            <div className="label">{statusLabels[s]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderProgressBar;