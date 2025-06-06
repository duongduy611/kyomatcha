// utils/sendMail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail', // Hoặc dùng SMTP riêng
	auth: {
		user: process.env.EMAIL_USERNAME, // trong .env
		pass: process.env.EMAIL_PASSWORD,
	},
});

const sendMailOrderConfirmation = async (to, order) => {
	const { _id, items, total, shippingInfo, paymentInfo } = order;

	const itemList = (items || [])
		.filter((item) => item && item.price)
		.map((item) => {
			const name = item.name || 'Sản phẩm';
			const quantity = item.quantity ?? 0;
			const price = Number(item.price) || 0;
			return `<li>${name} - SL: ${quantity} - Giá: ${price.toLocaleString()}đ</li>`;
		})
		.join('');

	const htmlContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6;">
    <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      
      <h2 style="color: #1a1a1a; text-align: center;">🧾 HÓA ĐƠN KYO MATCHA</h2>
      <p style="text-align: center; color: #555;">Cảm ơn bạn đã mua sắm tại <b>KyoMatcha</b>!</p>

      <p><b>Mã đơn hàng:</b> ${_id}</p>
      <p><b>Phương thức thanh toán:</b> ${paymentInfo?.method || 'Không rõ'}</p>
      <p><b>Người nhận:</b> ${shippingInfo?.receiverName || ''}</p>
      <p><b>Địa chỉ:</b> ${shippingInfo?.address || ''}</p>
      
      <hr style="margin: 20px 0;" />

      <table width="100%" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
        <thead>
          <tr style="background-color: #eee;">
            <th align="left">Sản phẩm</th>
            <th align="center">SL</th>
            <th align="right">Đơn giá</th>
          </tr>
        </thead>
        <tbody>
          ${items
						.map(
							(item) => `
            <tr style="border-bottom: 1px solid #ddd;">
              <td>${item.name}</td>
              <td align="center">${item.quantity}</td>
              <td align="right">${Number(item.price).toLocaleString()}đ</td>
            </tr>
          `
						)
						.join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" align="right"><b>Tổng cộng:</b></td>
            <td align="right"><b style="color: #28a745;">${(
							Number(total) || 0
						).toLocaleString()}đ</b></td>
          </tr>
        </tfoot>
      </table>

      <p style="margin-top: 30px; text-align: center;">
        Nếu có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi qua email hoặc fanpage Facebook.
      </p>
      <p style="text-align: center; color: #888;">— KyoMatcha Team —</p>
    </div>
  </div>
`;

	await transporter.sendMail({
		from: `"KyoMatcha" <${process.env.EMAIL_USERNAME}>`,
		to,
		subject: '🧾 Xác nhận đơn hàng từ KyoMatcha',
		html: htmlContent,
	});
};

module.exports = { sendMailOrderConfirmation };
