import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import socket from '../utils/socket';
import { Package, DollarSign, Users, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();

        socket.on('newOrder', (newOrder) => {
            setStats(prev => ({
                ...prev,
                totalOrders: prev.totalOrders + 1,
                totalRevenue: prev.totalRevenue + newOrder.totalAmount,
                pendingOrders: prev.pendingOrders + 1
            }));

            setRecentOrders(prev => [newOrder, ...prev].slice(0, 5));
        });

        return () => socket.off('newOrder');
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, usersRes] = await Promise.all([
                axios.get('/api/order/admin/all'),
                axios.get('/api/auth/admin/all')
            ]);

            const orders = ordersRes.data.orders || [];
            const users = usersRes.data.users || [];

            setStats({
                totalOrders: orders.length,
                totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
                totalUsers: users.length,
                pendingOrders: orders.filter(o => o.status === 'Pending').length
            });

            setRecentOrders(orders.slice(0, 5));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [selectedScreenshot, setSelectedScreenshot] = useState(null);

    // ✅ STATUS CHANGE HANDLER
    const updateOrderStatus = async (orderId, status) => {
        try {
            await axios.put(`/api/order/${orderId}`, { status });
            setRecentOrders(prev =>
                prev.map(o =>
                    o._id === orderId ? { ...o, status } : o
                )
            );
        } catch (err) {
            console.error('Status update failed', err);
        }
    };

    // ✅ VERIFY PAYMENT HANDLER
    const verifyPayment = async (orderId) => {
        const amount = prompt("Enter verified amount (Rs):");
        if (!amount) return;

        try {
            const { data } = await axios.put(`/api/order/verify/${orderId}`, { paidAmount: amount });
            setRecentOrders(prev =>
                prev.map(o =>
                    o._id === orderId ? data.order : o
                )
            );
            alert('Payment Verified Successfully!');
        } catch (err) {
            console.error('Payment verification failed', err);
            alert('Failed to verify payment');
        }
    };

    // ✅ REJECT PAYMENT HANDLER
    const rejectPayment = async (orderId) => {
        if (!window.confirm('Are you sure you want to REJECT this payment?')) return;
        try {
            const { data } = await axios.put(`/api/order/reject/${orderId}`);
            setRecentOrders(prev =>
                prev.map(o =>
                    o._id === orderId ? data.order : o
                )
            );
        } catch (err) {
            console.error('Payment rejection failed', err);
            alert('Failed to reject payment');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <h1 className="text-4xl font-bold text-black mb-2">Admin Dashboard</h1>
                <p className="text-gray-600 mb-8">Manage orders & monitor activity</p>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Orders', value: stats.totalOrders, icon: Package },
                        { label: 'Revenue', value: `Rs. ${stats.totalRevenue}`, icon: DollarSign },
                        { label: 'Users', value: stats.totalUsers, icon: Users },
                        { label: 'Pending', value: stats.pendingOrders, icon: Clock }
                    ].map((s, i) => (
                        <div key={i} className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">{s.label}</p>
                                    <p className="text-2xl font-bold text-black mt-1">{s.value}</p>
                                </div>
                                <s.icon className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <h2 className="text-2xl font-bold text-black mb-6">Recent Orders</h2>

                    {recentOrders.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No orders yet</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-gray-600">
                                    <th className="py-3 text-left">Order</th>
                                    <th className="py-3 text-left">Customer</th>
                                    <th className="py-3 text-left">Amount</th>
                                    <th className="py-3 text-left">Payment</th>
                                    <th className="py-3 text-left">Status</th>
                                    <th className="py-3 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr
                                        key={order._id}
                                        className={`border-b ${
                                            order.status === 'Delivered'
                                                ? 'bg-gray-50'
                                                : ''
                                        }`}
                                    >
                                        <td className="py-3 font-mono">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="py-3">
                                            <div className="font-medium text-gray-900">{order.customerName || 'Guest'}</div>
                                            <div className="text-xs text-gray-500 mb-1">{order.customerEmail}</div>
                                            <div className="text-xs text-gray-700 font-mono bg-gray-50 p-1 rounded inline-block">
                                                📞 {order.customerPhone || order.deliveryAddress?.phone || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 max-w-[150px] truncate" title={`${order.deliveryAddress?.street}, ${order.deliveryAddress?.city}`}>
                                                📍 {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                                            </div>
                                        </td>
                                        <td className="py-3 font-semibold text-blue-600">
                                            Rs. {order.totalAmount}
                                        </td>
                                        <td className="py-3">
                                            <div className="text-sm">
                                                <div className="font-bold mb-1">{order.paymentMethod}</div>
                                                
                                                {/* Payment Status Badge */}
                                                <span className={`text-xs px-2 py-1 rounded border ${
                                                    order.paymentStatus === 'BILL PAID ONLINE' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    order.paymentStatus === 'PAYMENT REJECTED' ? 'bg-red-100 text-red-700 border-red-200' :
                                                    order.paymentMethod === 'Online' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}>
                                                    {order.paymentStatus}
                                                </span>

                                                {/* Screenshot Link */}
                                                {order.paymentScreenshot && (
                                                    <button 
                                                        onClick={() => setSelectedScreenshot((import.meta.env.VITE_API_URL || 'http://localhost:5020') + order.paymentScreenshot)}
                                                        className="block text-xs text-blue-600 underline mt-2 hover:text-blue-800"
                                                    >
                                                        📷 View Proof
                                                    </button>
                                                )}

                                                {/* Verified Details */}
                                                {order.paymentStatus === 'BILL PAID ONLINE' && (
                                                    <div className="mt-2 text-xs text-green-700">
                                                        <div>Paid: Rs. {order.paidAmount}</div>
                                                        <div>{new Date(order.paymentVerifiedAt).toLocaleDateString()}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                order.status === 'Delivered'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 space-y-2">
                                            {/* Order Status Action */}
                                            {order.status !== 'Delivered' && (
                                                <button
                                                    onClick={() =>
                                                        updateOrderStatus(order._id, 'Delivered')
                                                    }
                                                    className="w-full px-3 py-1 text-xs font-bold rounded bg-green-600 text-white hover:bg-green-700"
                                                >
                                                    Mark Done
                                                </button>
                                            )}

                                            {/* Payment Actions */}
                                            {order.paymentMethod === 'Online' && 
                                             order.paymentStatus !== 'BILL PAID ONLINE' && 
                                             order.paymentStatus !== 'PAYMENT REJECTED' && (
                                                <div className="flex flex-col gap-2 mt-2">
                                                    <button
                                                        onClick={() => verifyPayment(order._id)}
                                                        className="px-3 py-1 text-xs font-bold rounded bg-blue-600 text-white hover:bg-blue-700"
                                                    >
                                                        Verify
                                                    </button>
                                                    <button
                                                        onClick={() => rejectPayment(order._id)}
                                                        className="px-3 py-1 text-xs font-bold rounded bg-red-100 text-red-600 hover:bg-red-200"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Screenshot Modal */}
                {selectedScreenshot && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80" onClick={() => setSelectedScreenshot(null)}>
                        <div className="relative max-w-4xl w-full bg-white rounded-lg p-2" onClick={e => e.stopPropagation()}>
                            <button 
                                onClick={() => setSelectedScreenshot(null)}
                                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                            >
                                ✕
                            </button>
                             <img src={selectedScreenshot} alt="Payment Proof" className="w-full h-auto rounded" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
