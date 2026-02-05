import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import socket from '../utils/socket';
import { Package, DollarSign, Users, TrendingUp, Clock, ShieldCheck } from 'lucide-react';

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

        // Real-time updates
        socket.on('newOrder', (newOrder) => {
            console.log('📈 Dashboard Update: New Order', newOrder);
            
            // Update Stats
            setStats(prev => ({
                ...prev,
                totalOrders: prev.totalOrders + 1,
                totalRevenue: prev.totalRevenue + newOrder.totalAmount,
                pendingOrders: prev.pendingOrders + 1
            }));

            // Update Recent Orders
            setRecentOrders(prev => [newOrder, ...prev].slice(0, 5));
        });

        return () => {
            socket.off('newOrder');
        };
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
                totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
                totalUsers: users.length,
                pendingOrders: orders.filter(o => o.status === 'Pending').length
            });

            setRecentOrders(orders.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Overview of your platform</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card p-6 animate-scale-in">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Package className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 animate-scale-in" style={{animationDelay: '50ms'}}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">Rs. {stats.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <DollarSign className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 animate-scale-in" style={{animationDelay: '100ms'}}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Users className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 animate-scale-in" style={{animationDelay: '150ms'}}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <Clock className="w-8 h-8 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link to="/admin/orders" className="card p-6 hover:shadow-xl transition-all group">
                        <Package className="w-12 h-12 text-royal-blue mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Orders</h3>
                        <p className="text-gray-600">View and update order status</p>
                    </Link>

                    <Link to="/admin/foods" className="card p-6 hover:shadow-xl transition-all group">
                        <TrendingUp className="w-12 h-12 text-royal-blue mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Foods</h3>
                        <p className="text-gray-600">Add, edit, or remove food items</p>
                    </Link>

                    <Link to="/admin/users" className="card p-6 hover:shadow-xl transition-all group">
                        <Users className="w-12 h-12 text-royal-blue mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Users</h3>
                        <p className="text-gray-600">View and manage users</p>
                    </Link>
                </div> */}

                {/* Recent Orders */}
                <div className="card p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No orders yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order._id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 font-mono text-sm">
                                                <div className="flex items-center gap-2">
                                                    #{order._id.slice(-8).toUpperCase()}
                                                    {order.isGuest && (
                                                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold">GUEST</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-gray-900">{order.customerName || order.user?.name || 'Anonymous'}</div>
                                                <div className="text-xs text-gray-500">{order.customerEmail || order.user?.email || 'N/A'}</div>
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-royal-blue">Rs. {order.totalAmount}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString('en-PK')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
