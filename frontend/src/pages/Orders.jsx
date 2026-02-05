import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

const Orders = () => {
    const { user } = useSelector(state => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/me');
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'Out for Delivery':
                return <Truck className="w-5 h-5 text-blue-500" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Out for Delivery':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Preparing':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-royal-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 animate-slide-up">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 animate-scale-in">
                        <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
                        <p className="text-gray-600 mb-8">You haven't placed any orders yet</p>
                        <a href="/browse" className="btn-primary inline-block">
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <div 
                                key={order._id} 
                                className="card p-6 hover:shadow-xl transition-all animate-slide-up"
                                style={{animationDelay: `${index * 50}ms`}}
                            >
                                {/* Order Header */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-mono font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                        <p className="text-sm text-gray-600">Placed on</p>
                                        <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('en-PK', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}</p>
                                    </div>
                                    <div className={`mt-2 md:mt-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        <span className="font-semibold">{order.status}</span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4 mb-6">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <img 
                                                src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"} 
                                                alt={item.name} 
                                                className="w-20 h-20 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                                                }}
                                            />
                                            <div className="flex-grow">
                                                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                <p className="text-sm font-bold text-royal-blue">Rs. {item.price} × {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t">
                                    <div>
                                        <p className="text-sm text-gray-600">Delivery Address</p>
                                        <p className="font-medium text-gray-900">
                                            {order.deliveryAddress.street}, {order.deliveryAddress.city} - {order.deliveryAddress.zip}
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-right">
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-2xl font-bold text-royal-blue">Rs. {order.totalAmount}</p>
                                        <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
