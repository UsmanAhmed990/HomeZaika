import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, saveShippingInfo } from '../features/cartSlice';
import { MapPin, Phone, User, Home } from 'lucide-react';
import axios from '../utils/axios';

const Checkout = () => {
    const { cartItems, shippingInfo } = useSelector(state => state.cart);
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

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const deliveryFee = 150;
    const total = subtotal + deliveryFee;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create order
            const orderData = {
                items: cartItems.map(item => ({
                    food: item.food,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                totalAmount: total,
                paymentMethod: 'COD',
                deliveryAddress: {
                    street: address.street,
                    city: address.city
                },
                customerName: address.username,
                customerEmail: address.email,
                customerPhone: address.phone
            };

            await axios.post('/api/order/new', orderData);
            
            // Clear cart and reset local state
            dispatch(clearCart());
            setAddress({
                street: '',
                city: '',
                username: '',
                email: '',
                phone: ''
            });

            alert('✅ Order placed successfully! A confirmation email has been sent.');
            navigate('/orders');
        } catch (error) {
            console.error('Order error:', error);
            alert('❌ Failed to place order. Please try again.');
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8 animate-slide-up">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Delivery Address Form */}
                    <div className="lg:col-span-2">
                        <div className="card p-8 animate-slide-up">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-royal-blue" />
                                Delivery Details
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Customer Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            placeholder="Your Name"
                                            value={address.username}
                                            onChange={(e) => setAddress({...address, username: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="input-field"
                                            placeholder="your@email.com"
                                            value={address.email}
                                            onChange={(e) => setAddress({...address, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Home className="w-4 h-4 inline mr-2" />
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="House # 123, Street Name"
                                        value={address.street}
                                        onChange={(e) => setAddress({...address, street: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            placeholder="Karachi"
                                            value={address.city}
                                            onChange={(e) => setAddress({...address, city: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            className="input-field"
                                            placeholder="03XX-XXXXXXX"
                                            value={address.phone}
                                            onChange={(e) => setAddress({...address, phone: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t">
                                    <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="font-semibold text-green-800">💵 Cash on Delivery (COD)</p>
                                        <p className="text-sm text-green-700 mt-1">Pay when you receive your order</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Placing Order...
                                        </span>
                                    ) : (
                                        `Place Order - Rs. ${total}`
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24 animate-scale-in">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item.food} className="flex gap-3">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-16 h-16 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                                            }}
                                        />
                                        <div className="flex-grow">
                                            <h4 className="font-semibold text-sm">{item.name}</h4>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold text-royal-blue">Rs. {item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">Rs. {subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="font-semibold">Rs. {deliveryFee}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold border-t pt-3">
                                    <span>Total</span>
                                    <span className="text-royal-blue">Rs. {total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
