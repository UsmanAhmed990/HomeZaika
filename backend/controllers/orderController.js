const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

// Create New Order
exports.createOrder = async (req, res) => {
    try {
        let {
            items,
            deliveryAddress,
            paymentMethod,
            totalAmount,
            customerName,
            customerEmail,
            customerPhone
        } = req.body;

        // Parse JSON fields if coming from FormData (Multipart)
        if (typeof items === 'string') items = JSON.parse(items);
        if (typeof deliveryAddress === 'string') deliveryAddress = JSON.parse(deliveryAddress);

        let paymentScreenshotUrl = '';
        let paymentStatus = 'Pending';

        // Handle Screenshot Upload
        if (req.file) {
            // Save relative path for static serving
            // multer saves to 'backend/uploads/payments', we want to serve from 'uploads/payments'
            // The static middleware serves 'backend/uploads' at '/uploads'
            // So 'backend/uploads/payments/filename.jpg' -> '/uploads/payments/filename.jpg'
            paymentScreenshotUrl = '/uploads/payments/' + req.file.filename;
            paymentStatus = 'Pending Online Verification';
        }

        // Check if user is logged in and has a valid ID (not guest_admin)
        const isGuest = !req.user || req.user.id === 'guest_admin';
        const userId =
            req.user && req.user.id !== 'guest_admin' ? req.user.id : null;

        const order = await Order.create({
            items,
            deliveryAddress,
            paymentMethod,
            totalAmount,
            customerName,
            customerEmail,
            customerPhone,
            isGuest,
            user: userId,
            paymentStatus,
            paymentScreenshot: paymentScreenshotUrl
        });

        // Real-time update for Admin/Chef
        const io = req.app.get('socketio');
        if (io) {
            io.emit('newOrder', order);
        }

        // ================== SEND ORDER CONFIRMATION EMAIL ==================
        const itemsList = items
            .map(
                item =>
                    `<li>
                        <strong>${item.name}</strong>
                        (x${item.quantity}) — Rs. ${item.price * item.quantity}
                    </li>`
            )
            .join('');

        const targetEmail = customerEmail;

        if (targetEmail) {
            const emailOptions = {
                email: targetEmail,
                subject:
                    'Your Order Has Been Placed Successfully 🍽️ | HOMEZaika',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color:#16a34a;">
                            Hi ${customerName || 'Customer'} 👋
                        </h2>

                        <p>
                            Thank you for your order! 🎉  
                            You have successfully placed the following order with
                            <strong>HOMEZaika</strong>.
                        </p>

                        <h3 style="margin-top:20px;">🛒 Items You Ordered:</h3>
                        <ul>
                            ${itemsList}
                        </ul>

                        <p><strong>Total Amount:</strong> Rs. ${totalAmount}</p>
                        <p><strong>Payment Method:</strong> ${paymentMethod}</p>

                        <h3 style="margin-top:20px;">📍 Delivery Address</h3>
                        <p>
                            ${deliveryAddress.street}, ${deliveryAddress.city}
                        </p>
                        <p>
                            <strong>Contact:</strong>
                            ${customerPhone || deliveryAddress.phone}
                        </p>

                        <p style="margin-top:25px;">
                            🍳 Your homemade meal is now being prepared with love.
                            We’ll notify you once it’s on the way!
                        </p>

                        <p style="margin-top:30px;">
                            Regards,<br/>
                            <strong>HOMEZaika Team</strong>
                        </p>
                    </div>
                `
            };

            try {
                await sendEmail(emailOptions);
                console.log(
                    '✅ Order confirmation email sent to customer'
                );
            } catch (emailError) {
                console.error(
                    '❌ Email failed to send:',
                    emailError
                );
            }
        }
        // ================== EMAIL SECTION END ==================

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('CREATE ORDER ERROR:', error);
        console.error('Stack:', error.stack);
        console.error('Body:', JSON.stringify(req.body));
        res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
};

// Get My Orders (Customer)
exports.getMyOrders = async (req, res) => {
    try {
        if (!req.user || req.user.id === 'guest_admin') {
            return res
                .status(200)
                .json({ success: true, orders: [] });
        }

        const orders = await Order.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Chef Orders (Chef)
exports.getChefOrders = async (req, res) => {
    try {
        let chefId;

        if (
            req.user.role === 'admin' ||
            req.user.id === 'guest_admin'
        ) {
            const Chef = require('../models/Chef');
            const adminChef = await Chef.findOne({
                businessName: 'Home Zaika Admin'
            });

            if (adminChef) {
                chefId = adminChef._id;
            } else {
                return res
                    .status(200)
                    .json({ success: true, orders: [] });
            }
        } else {
            const Chef = require('../models/Chef');
            const chef = await Chef.findOne({
                user: req.user.id
            });

            if (!chef)
                return res
                    .status(404)
                    .json({ message: 'Chef not found' });

            chefId = chef._id;
        }

        const orders = await Order.find({
            chef: chefId
        })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Order Status (Chef/Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res
                .status(404)
                .json({ message: 'Order not found' });
        }

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Orders (Admin)
exports.getAdminAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify Payment (Admin)
exports.verifyPayment = async (req, res) => {
    try {
        const { paidAmount } = req.body;

        if (!paidAmount || isNaN(paidAmount)) {
            return res.status(400).json({ message: 'Valid paid amount is required' });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentStatus = 'BILL PAID ONLINE';
        order.paidAmount = Number(paidAmount);
        order.paymentVerifiedAt = Date.now();
        order.verifiedBy = req.user && req.user.id ? req.user.id : 'admin';

        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reject Payment (Admin)
exports.rejectPayment = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.paymentStatus = 'PAYMENT REJECTED';
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
