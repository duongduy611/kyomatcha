const Contact = require('../models/ContactModel');

const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const existed = await Contact.findOne({ email, message });
        if (existed) {
            return res.status(400).json({
                success: false,
                message: "Bạn đã gửi nội dung này rồi. Vui lòng không gửi lặp lại."
            });
        }

        const contact = new Contact({ name, email, message });
        await contact.save();

        res.json({ success: true, message: "Gửi thông tin thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createContact };