import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../features/cartSlice';
import { MapPin, Phone, User, Home } from 'lucide-react';
import axios from '../utils/axios';

const Checkout = () => {
    const { cartItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        street: '',
        city: '',
        username: '',
        email: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [paymentFile, setPaymentFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // ✅ ADDED: Mobile payment openers
    const openJazzCash = () => {
        window.location.href =
            'intent://#Intent;scheme=jazzcash;package=com.techlogix.mobilinkcustomer;end';
    };

    const openEasyPaisa = () => {
        window.location.href =
            'intent://#Intent;scheme=easypaisa;package=com.telenor.easypaisa;end';
    };

    const openBank = () => {
        alert('Please open your banking app and transfer to Meezan Bank (Account: 1234567890)');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPaymentFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const deliveryFee = 150;
    const total = subtotal + deliveryFee;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (paymentMethod === 'Online' && !paymentFile) {
                alert('Please upload a payment screenshot');
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append(
                'items',
                JSON.stringify(
                    cartItems.map(item => ({
                        food: item.food,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                    }))
                )
            );

            formData.append('totalAmount', total);
            formData.append('paymentMethod', paymentMethod);
            formData.append(
                'deliveryAddress',
                JSON.stringify({
                    street: address.street,
                    city: address.city
                })
            );
            formData.append('customerName', address.username);
            formData.append('customerEmail', address.email);
            formData.append('customerPhone', address.phone);

            if (paymentFile) {
                formData.append('paymentScreenshot', paymentFile);
            }

            await axios.post('/api/order/new', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            dispatch(clearCart());
            alert('✅ Order placed successfully!');
            navigate('/orders');
        } catch (error) {
            console.error(error);
            alert('❌ Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Checkout</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Address Form */}
                        <div className="card p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <MapPin className="text-blue-600" size={20} />
                                Delivery Address
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={address.username}
                                        onChange={(e) => setAddress({ ...address, username: e.target.value })}
                                        className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder=""
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={address.phone}
                                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                        className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder=""
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={address.email}
                                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                                        className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <textarea
                                        required
                                        rows="2"
                                        value={address.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="House #123, Street 4, Sector F-10"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        required
                                        value={address.city}
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        className="input-field w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card p-8 bg-white rounded-xl shadow-sm border border-gray-100">

                        {/* Payment Section */}
                        <h3 className="font-bold text-lg mb-4">Payment Method</h3>

                        {/* COD */}
                        <label className={`flex items-start p-4 border rounded-xl cursor-pointer ${paymentMethod === 'COD' ? 'border-royal-blue bg-blue-50' : ''}`}>
                            <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="mr-3 mt-1" />
                            <div>
                                <p className="font-bold">Cash on Delivery</p>
                                <p className="text-sm text-gray-500">Pay on delivery</p>
                            </div>
                        </label>

                        {/* Online */}
                        <label className={`flex items-start p-4 border rounded-xl cursor-pointer mt-4 ${paymentMethod === 'Online' ? 'border-royal-blue bg-blue-50' : ''}`}>
                            <input type="radio" checked={paymentMethod === 'Online'} onChange={() => setPaymentMethod('Online')} className="mr-3 mt-1" />
                            <div>
                                <p className="font-bold">Pay Online</p>
                                <p className="text-sm text-gray-500">JazzCash / EasyPaisa / Bank</p>
                            </div>
                        </label>

                        {paymentMethod === 'Online' && (
                            <div className="mt-4 p-5 bg-gray-50 rounded-xl border">

                                <ul className="space-y-3 mb-4">
                                    <li onClick={openBank} className="cursor-pointer p-3 bg-white rounded-lg border hover:bg-blue-50">
                                        🏦 <strong>Bank Transfer:</strong> Meezan Bank – 1234567890
                                    </li>

                                    <li onClick={openJazzCash} className="cursor-pointer p-3 bg-white rounded-lg border hover:bg-blue-50">
                                        📱 <strong>JazzCash:</strong> 0300-1234567
                                    </li>

                                    <li onClick={openEasyPaisa} className="cursor-pointer p-3 bg-white rounded-lg border hover:bg-blue-50">
                                        💸 <strong>EasyPaisa:</strong> 0300-7654321
                                    </li>
                                </ul>

                                <input type="file" accept="image/*" onChange={handleFileChange} />
                                {preview && <img src={preview} alt="preview" className="mt-3 h-32" />}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
                            {loading ? 'Placing Order...' : `Place Order - Rs. ${total}`}
                        </button>
                    </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
