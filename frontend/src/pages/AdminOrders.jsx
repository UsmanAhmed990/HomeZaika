import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import socket from '../utils/socket';
import { Package, Search, Filter, User, Mail, ShieldCheck } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchOrders();

        // Listen for real-time orders
        socket.on('newOrder', (newOrder) => {
            console.log('🆕 Real-time Order Received:', newOrder);
            setOrders(prev => [newOrder, ...prev]);
        });

        return () => {
            socket.off('newOrder');
        };
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/admin/all');
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/order/${orderId}`, { status: newStatus });
            setOrders(orders.map(order => 
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (error) {
            console.error('Error updating order:', error);
            alert('❌ Failed to update order status');
        }
    };

    const filteredOrders = filter === 'All' 
        ? orders 
        : orders.filter(order => order.status === filter);

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
                <div className="flex justify-between items-center mb-8 animate-slide-up">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Orders</h1>
                        <p className="text-gray-600">View and update order status</p>
                    </div>
                    {/* Live Indicator */}
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 shadow-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold">Live Updates Active</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="card p-4 mb-6 flex flex-wrap gap-4 items-center">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <div className="flex gap-2 flex-wrap">
                        {['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                    filter === status
                                        ? 'bg-royal-blue text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h2>
                        <p className="text-gray-600">No orders match the selected filter</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order, index) => (
                            <div 
                                key={order._id} 
                                className={`card p-6 animate-slide-up border-l-4 ${order.isGuest ? 'border-l-purple-500 bg-purple-50/10' : 'border-l-blue-500'}`}
                                style={{animationDelay: `${index * 30}ms`}}
                            >
                                {/* Order Header */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Order ID</p>
                                            <p className="font-mono font-semibold text-lg">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        {order.isGuest && (
                                            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-purple-200">
                                                <ShieldCheck size={12} />
                                                GUEST ORDER
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                        <p className="text-sm text-gray-600">Customer Details</p>
                                        <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                            <User size={14} className="text-gray-400" />
                                            {order.customerName || order.user?.name || 'Anonymous'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Mail size={12} className="text-gray-400" />
                                            {order.customerEmail || order.user?.email || 'No Email'}
                                        </div>
                                    </div>
                                    <div className="mt-2 md:mt-0">
                                        <p className="text-sm text-gray-600">Order Date</p>
                                        <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('en-PK')}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-3">Items:</h3>
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                                                <img 
                                                    src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"} 
                                                    alt={item.name} 
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                                                    }}
                                                />
                                                <div className="flex-grow">
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity} × Rs. {item.price}</p>
                                                </div>
                                                <p className="font-bold text-royal-blue">Rs. {item.quantity * item.price}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
                                    <div>
                                        <p className="text-sm text-gray-600">Delivery Address</p>
                                        <p className="font-medium">
                                            {order.deliveryAddress.street}, {order.deliveryAddress.city}
                                        </p>
                                        {(order.customerPhone || order.deliveryAddress.phone) && (
                                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                <Phone size={12} />
                                                {order.customerPhone || order.deliveryAddress.phone}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Update Status</p>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Preparing">Preparing</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-3xl font-bold text-royal-blue">Rs. {order.totalAmount}</p>
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

export default AdminOrders;
