const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const nodemailer = require('nodemailer');


let otpStore = {};       // { [email]: { otp, expires } }
let cooldownStore = {};

const OTP_EXPIRATION_MS = 10 * 60 * 1000; // 5 phút
const COOLDOWN_MS = 30 * 1000; 

exports.register = async (req, res) => {
  const { email, password, fullName, phone, address } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email đã tồn tại' });
  }
  const hash = bcrypt.hashSync(password, 8);
  const user = new User({ email, password: hash, fullName, phone, address });
  await user.save();
  res.json({ message: 'Đăng ký thành công', user: { email, fullName, phone, address, role: user.role, status: user.status } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email || '' });
  if (!user) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
  const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({
    token,
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    status: user.status
  });
};

exports.protected = (req, res) => {
  res.json({ message: 'Đã xác thực!', user: req.user });
};

exports.updateProfile = async (req, res) => {
  const { fullName, phone, address } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    user.fullName = fullName;
    user.phone = phone;
    user.address = address;
    await user.save();
    res.json({ message: 'Cập nhật thành công', user: { fullName, phone, address } });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });
    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 

exports.GoogleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Xác thực token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    const username = email.split('@')[0];

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username,
        email,
        password: email, // Gán sub làm password tạm, không dùng đến
        fullName: name,
        status: 'ACTIVE',
        role: 'CUSTOMER'
      });

      await user.save();
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Token không hợp lệ', error: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const now = Date.now();

  // 🔁 Kiểm tra cooldown
  if (cooldownStore[email] && cooldownStore[email] > now) {
    return res.status(429).json({ message: 'Vui lòng đợi 30s trước khi gửi lại OTP.' });
  }

  // 🎲 Tạo OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = now + OTP_EXPIRATION_MS;

  // 📧 Gửi email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"KyoMatcha Xác thực" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'Xác thực tài khoản - Mã OTP từ KyoMatcha',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto;text-align: center;">
        <h2 style="color: #527328;">Xin chào từ KyoMatcha 🍵</h2>
        <p>Bạn vừa thực hiện đăng ký tài khoản với địa chỉ email: <b>${email}</b>.</p>
        <p>Để hoàn tất, vui lòng sử dụng mã OTP dưới đây để xác thực tài khoản:</p>
        <div style="font-size: 24px; font-weight: bold; background-color: #f6f6ee; padding: 12px 24px; text-align: center; border-radius: 8px; border: 1px dashed #ccc; width: fit-content; margin: 16px auto;">
          ${otp}
        </div>
        <p>Mã OTP này sẽ hết hạn trong <b>10 phút</b>. Không chia sẻ mã này cho bất kỳ ai.</p>
        <p>Nếu bạn không yêu cầu thao tác này, vui lòng bỏ qua email này.</p>
        <p style="margin-top: 24px;">Trân trọng,<br/>Đội ngũ <b>KyoMatcha</b></p>
      </div>
    `,
  };
  

  try {
    await transporter.sendMail(mailOptions);

    // 💾 Lưu OTP và cooldown
    otpStore[email] = { otp, expires };
    cooldownStore[email] = now + COOLDOWN_MS;

    res.json({ success: true, message: 'Đã gửi OTP.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi gửi mail', error: err.message });
  }
};

exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];
  const now = Date.now();

  if (!record) {
    return res.status(400).json({ success: false, message: 'OTP chưa được gửi hoặc đã hết hạn.' });
  }

  if (now > record.expires) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: 'OTP đã hết hạn.' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: 'OTP không đúng.' });
  }

  // ✅ Xác minh thành công
  delete otpStore[email];
  delete cooldownStore[email];
  return res.json({ success: true, message: 'Xác thực thành công.' });
};


exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  res.json({ exists: !!user });
};


