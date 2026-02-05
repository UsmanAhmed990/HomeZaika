import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import { Plus, Edit, Trash, ShoppingBag, Clock } from 'lucide-react';
import FoodAvailabilityToggle from '../components/admin/FoodAvailabilityToggle';
import OrderStatusBadge from '../components/admin/OrderStatusBadge';

const ChefDashboard = () => {
    const { user } = useSelector(state => state.auth);
    const [foods, setFoods] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'orders'
    
    // Form State
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Lunch', // default
        dietType: 'Regular', // default
        image: ''
    });

    useEffect(() => {
        fetchMyMenu();
        fetchMyOrders();
    }, []);

    const fetchMyMenu = async () => {
        try {
            // Fetch all foods and filter client-side for now as per previous logic
            const { data } = await axios.get('/api/food');
            const myFoods = data.foods.filter(f => f.chef && (f.chef.user === user._id || f.chef.user._id === user._id));
            setFoods(myFoods);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyOrders = async () => {
        try {
            // Using the endpoint we checked earlier
            const { data } = await axios.get('/api/order/chef/orders'); 
            setOrders(data.orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            // New Item
            const foodData = { ...newItem, images: [newItem.image] }; // Simple array wrap
            await axios.post('/api/food/add', foodData);
            alert('Food added successfully!');
            setShowAddForm(false);
            setNewItem({ name: '', description: '', price: '', category: 'Lunch', dietType: 'Regular', image: '' });
            fetchMyMenu();
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding item');
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/order/${orderId}/status`, { status: newStatus });
            // Optimistic update or refetch
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert('Failed to update order status');
            console.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Chef Dashboard</h1>
                    <p className="text-gray-600">Manage your menu and orders</p>
                </div>
                
                <div className="flex space-x-4">
                     <button 
                        onClick={() => setActiveTab('menu')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'menu' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        My Menu
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'orders' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Orders {orders.filter(o => o.status === 'Pending').length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{orders.filter(o => o.status === 'Pending').length}</span>}
                    </button>
                </div>

                {activeTab === 'menu' && (
                    <button 
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center bg-royal-blue text-white px-4 py-2 rounded-lg hover:bg-royal-blue-dark transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Add New Dish
                    </button>
                )}
            </div>

            {activeTab === 'menu' ? (
                <>
                    {showAddForm && (
                        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-100 animate-scale-in">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Add New Food Item</h2>
                            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Food Name</label>
                                    <input type="text" placeholder="e.g., Chicken Biryani" required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                                        value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Price (PKR)</label>
                                    <input type="number" placeholder="e.g., 500" required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                                        value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Category</label>
                                    <select className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                                        <option value="Breakfast">Breakfast</option>
                                        <option value="Lunch">Lunch</option>
                                        <option value="Dinner">Dinner</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Diet Type</label>
                                    <select className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" value={newItem.dietType} onChange={e => setNewItem({...newItem, dietType: e.target.value})}>
                                        <option value="Regular">Regular</option>
                                        <option value="Keto">Keto</option>
                                        <option value="Diabetic">Diabetic Friendly</option>
                                        <option value="Vegan">Vegan</option>
                                        <option value="Desi">Desi</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Image URL</label>
                                    <input type="text" placeholder="https://..." className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                                        value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} />
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Description</label>
                                    <textarea placeholder="Describe your delicious dish..." className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" rows="3"
                                         value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea>
                                </div>

                                <button type="submit" className="md:col-span-2 bg-royal-blue text-white py-3 rounded-xl font-bold hover:bg-royal-blue-dark transition shadow-md hover:shadow-lg">
                                    Save Item
                                </button>
                            </form>
                        </div>
                    )}

                    {foods.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-xl font-medium text-gray-500">Your menu is empty</p>
                            <p className="text-gray-400">Add your first dish to start selling!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {foods.map(food => (
                                <div key={food._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden group">
                                    <div className="relative h-48 bg-gray-200">
                                        <img src={food.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'} alt={food.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                                                {food.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">{food.name}</h3>
                                            <p className="font-bold text-royal-blue">Rs. {food.price}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{food.description}</p>
                                        
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <FoodAvailabilityToggle 
                                                    foodId={food._id} 
                                                    initialStatus={food.available} 
                                                    onUpdate={(updatedFood) => {
                                                        setFoods(prev => prev.map(f => f._id === updatedFood._id ? updatedFood : f));
                                                    }}
                                                />
                                            </div>
                                            <div className="flex space-x-1">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"><Edit className="w-4 h-4" /></button>
                                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition" onClick={async () => {
                                                    if(confirm('Delete this item?')) {
                                                        await axios.delete(`/api/food/${food._id}`);
                                                        fetchMyMenu();
                                                    }
                                                }}><Trash className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                /* Orders View */
                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-xl font-medium text-gray-500">No orders yet</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between gap-6 transition hover:shadow-md">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
                                        <OrderStatusBadge status={order.status} />
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                    </p>
                                    
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded-lg">
                                                <span className="font-medium text-gray-700">{item.quantity}x {item.name || 'Food Item'}</span>
                                                <span className="text-gray-600">Rs. {item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                        <p className="font-bold text-gray-900">Total Amount</p>
                                        <p className="font-bold text-xl text-royal-blue">Rs. {order.totalAmount}</p>
                                    </div>

                                    <div className="mt-4 text-sm text-gray-500">
                                        <p><span className="font-semibold">Customer:</span> {order.customerName || 'Guest'}</p>
                                        <p><span className="font-semibold">Address:</span> {order.deliveryAddress?.street}, {order.deliveryAddress?.city}</p>
                                    </div>
                                </div>

                                <div className="w-full md:w-64 flex flex-col justify-center gap-3 border-l pl-0 md:pl-6 border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Update Status</p>
                                    
                                    <button 
                                        onClick={() => updateOrderStatus(order._id, 'Pending')}
                                        disabled={order.status === 'Pending'}
                                        className={`w-full py-2 px-4 rounded-xl font-medium text-sm transition ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 ring-2 ring-yellow-200 cursor-default' : 'bg-white border hover:bg-gray-50 text-gray-700'}`}
                                    >
                                        Pending
                                    </button>
                                    <button 
                                        onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                        disabled={order.status === 'Delivered'}
                                        className={`w-full py-2 px-4 rounded-xl font-medium text-sm transition ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 ring-2 ring-green-200 cursor-default' : 'bg-white border hover:bg-gray-50 text-gray-700'}`}
                                    >
                                        Delivered
                                    </button>
                                    <button 
                                        onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                        disabled={order.status === 'Cancelled'}
                                        className={`w-full py-2 px-4 rounded-xl font-medium text-sm transition ${order.status === 'Cancelled' ? 'bg-red-50 text-red-700 ring-2 ring-red-200 cursor-default' : 'bg-white border hover:bg-gray-50 text-gray-700'}`}
                                    >
                                        Cancelled
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ChefDashboard;
