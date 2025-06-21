const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const sendMailOrderConfirmation = async (to, order) => {
	const { _id, items, total, shippingInfo, paymentInfo, createdAt } = order;

	const itemRows = items
		.map((item) => {
			const name = item.name || 'Sản phẩm';
			const quantity = item.quantity ?? 0;
			const price = Number(item.price) || 0;
			const totalPrice = price * quantity;
			return `
        <tr style="border-bottom: 1px solid #ccc;">
          <td>${name}</td>
          <td align="center">${quantity}</td>
          <td align="center">${price.toLocaleString()}đ</td>
          <td align="right">${totalPrice.toLocaleString()}đ</td>
        </tr>`;
		})
		.join('');

	const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
  <title>Hóa đơn</title>
</head>
<body style="margin:0;padding:40px 300px;background-color:#fff;color:#000;font-family:'Montserrat',sans-serif;">
  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    <tr>
      <td style="vertical-align:top;">
        <img src="https://kyomatcha.id.vn/static/media/kyo-matcha-logo.e628b10ef86ee98064f9.png"
             width="100" height="100" style="display:block;border:0;margin:0;padding:0;" />
      </td>
      <td style="text-align:right;">
        <span style="font-size:36px;font-weight:bold;color:#3d7925;">HÓA ĐƠN</span>
      </td>
    </tr>
  </table>

  <!-- Khách hàng & Invoice meta -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:40px;">
    <tr>
      <td style="vertical-align:top;line-height:1.5;">
        <strong>KHÁCH HÀNG:</strong><br/>
        ${shippingInfo?.receiverName || ''}<br/>
        ${shippingInfo?.phone || ''}<br/>
        ${shippingInfo?.address || ''}<br/>
        <strong>PHƯƠNG THỨC THANH TOÁN:</strong> ${
					paymentInfo?.method || 'Không rõ'
				}
      </td>
      <td style="text-align:right;vertical-align:top;line-height:1.5;">
        <div><strong>Số hóa đơn:</strong> ${_id
					.toString()
					.slice(-6)
					.toUpperCase()}</div>
        <div>Ngày: ${new Date(createdAt).toLocaleDateString('vi-VN')}</div>
      </td>
    </tr>
  </table>

  <!-- Bảng sản phẩm -->
  <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;margin-top:30px;border-top:1px solid #ccc;border-bottom:1px solid #ccc;">
    <thead>
      <tr style="background-color:#f0f0f0;">
        <th align="left"  style="border-bottom:1px solid #ccc;">Sản phẩm</th>
        <th align="center" style="border-bottom:1px solid #ccc;">Số lượng</th>
        <th align="center" style="border-bottom:1px solid #ccc;">Đơn giá</th>
        <th align="right" style="border-bottom:1px solid #ccc;">Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      ${items
        .map((item) => {
          // 1️⃣ Tách ra displayName tuỳ theo kind
          let displayName;
          if (item.kind === 'Product') {
            // với product: đã enrich thành item.product.name
            displayName = item.product?.name || 'Sản phẩm';
          } else {
            // với combo: lấy comboTitle, nếu có variant thì thêm " – variant"
            displayName = item.comboTitle;
            if (item.variant?.title) {
              displayName += ` – ${item.variant.title}`;
            }
          }

          // 2️⃣ Lấy số lượng & giá
          const qty = item.quantity || 0;
          const price = Number(item.price) || 0;
          const lineTotal = price * qty;

          return `
            <tr style="border-bottom:1px solid #ccc;">
              <td>${displayName}</td>
              <td align="center">${qty}</td>
              <td align="center">${price.toLocaleString()}đ</td>
              <td align="right">${lineTotal.toLocaleString()}đ</td>
            </tr>`;
        })
        .join('')}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" style="padding:8px;border-top:1px solid #ccc;font-weight:bold;">Tạm tính</td>
        <td align="right" style="padding:8px;border-top:1px solid #ccc;font-weight:bold;">
          ${Number(total).toLocaleString()}đ
        </td>
      </tr>
    </tfoot>
  </table>

  <!-- Tổng cộng -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-collapse:collapse;">
    <tr>
      <td></td>
      <td style="text-align:right;font-size:20px;line-height:1.5;">
        <strong>Tổng cộng:</strong>
        <span style="color:#3d7925;margin-left:10px;">${Number(
					total
				).toLocaleString()}đ</span>
      </td>
    </tr>
  </table>

  <!-- Lời cảm ơn -->
  <p style="margin-top:40px;font-size:16px;line-height:1.5;">
    Cảm ơn bạn đã mua hàng tại KyoMatcha!
  </p>

  <!-- Liên hệ & Footer -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:30px;">
    <tr>
      <td style="vertical-align:top;font-size:14px;line-height:1.5;">
        <strong>LIÊN HỆ HỖ TRỢ</strong><br/>
        Mọi thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ chúng tôi qua:<br/>
         Hotline: <b>098 282 64 38</b><br/>
         Facebook: <a href="https://www.facebook.com/kyomatcha" target="_blank">facebook.com/kyomatcha</a><br/>
         Website: <a href="http://kyomatcha.id.vn/" target="_blank">kyomatcha.id.vn</a>
      </td>
      <td style="text-align:right;vertical-align:top;font-size:14px;line-height:1.5;padding-top:64px;">
        KyoMatcha Vietnam<br/>
        Thạch Thất, Thạch Hòa, Hà Nội
      </td>
    </tr>
  </table>
</body>
</html>
`;

	await transporter.sendMail({
		from: `"KyoMatcha" <${process.env.EMAIL_USERNAME}>`,
		to,
		subject: 'Xác nhận đơn hàng từ KyoMatcha',
		html: htmlContent,
	});
};

module.exports = { sendMailOrderConfirmation };
