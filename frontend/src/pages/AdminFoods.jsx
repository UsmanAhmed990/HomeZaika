import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

const AdminFoods = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Lunch',
        dietType: 'Regular',
        available: true
    });

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        try {
            const { data } = await axios.get('/api/food/all');
            setFoods(data.foods || []);
        } catch (error) {
            console.error('Error fetching foods:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFood) {
                await axios.put(`/api/food/${editingFood._id}`, formData);
                alert('✅ Food updated successfully!');
            } else {
                await axios.post('/api/food/new', formData);
                alert('✅ Food added successfully!');
            }
            setShowModal(false);
            setEditingFood(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'Lunch',
                dietType: 'Regular',
                available: true
            });
            fetchFoods();
        } catch (error) {
            console.error('Error saving food:', error);
            alert('❌ Failed to save food item');
        }
    };

    const handleEdit = (food) => {
        setEditingFood(food);
        setFormData({
            name: food.name,
            description: food.description,
            price: food.price,
            category: food.category,
            dietType: food.dietType,
            available: food.available
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this food item?')) return;
        
        try {
            await axios.delete(`/api/food/${id}`);
            alert('✅ Food deleted successfully!');
            fetchFoods();
        } catch (error) {
            console.error('Error deleting food:', error);
            alert('❌ Failed to delete food item');
        }
    };

    const toggleAvailability = async (id, currentStatus) => {
        try {
            await axios.put(`/api/food/${id}`, { available: !currentStatus });
            setFoods(foods.map(food => 
                food._id === id ? { ...food, available: !currentStatus } : food
            ));
        } catch (error) {
            console.error('Error updating availability:', error);
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
                <div className="flex justify-between items-center mb-8 animate-slide-up">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Foods</h1>
                        <p className="text-gray-600">Add, edit, or remove food items</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingFood(null);
                            setFormData({
                                name: '',
                                description: '',
                                price: '',
                                category: 'Lunch',
                                dietType: 'Regular',
                                available: true
                            });
                            setShowModal(true);
                        }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Food
                    </button>
                </div>

                {/* Foods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {foods.map((food, index) => (
                        <div 
                            key={food._id} 
                            className="card overflow-hidden animate-scale-in"
                            style={{animationDelay: `${index * 30}ms`}}
                        >
                            <div className="relative h-48">
                                <img 
                                    src={food.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"} 
                                    alt={food.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                                    }}
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => toggleAvailability(food._id, food.available)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            food.available 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-500 text-white'
                                        }`}
                                    >
                                        {food.available ? 'Available' : 'Unavailable'}
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{food.name}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{food.description}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold text-royal-blue">Rs. {food.price}</span>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            {food.category}
                                        </span>
                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                            {food.dietType}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(food)}
                                        className="flex-1 bg-royal-blue text-white py-2 rounded-lg hover:bg-royal-blue-dark transition flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(food._id)}
                                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 animate-scale-in">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        className="input-field"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="input-field"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <select
                                            className="input-field"
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        >
                                            <option value="Breakfast">Breakfast</option>
                                            <option value="Lunch">Lunch</option>
                                            <option value="Dinner">Dinner</option>
                                            <option value="Snacks">Snacks</option>
                                            <option value="Dessert">Dessert</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Diet Type</label>
                                        <select
                                            className="input-field"
                                            value={formData.dietType}
                                            onChange={(e) => setFormData({...formData, dietType: e.target.value})}
                                        >
                                            <option value="Regular">Regular</option>
                                            <option value="Keto">Keto</option>
                                            <option value="Diabetic">Diabetic</option>
                                            <option value="Vegan">Vegan</option>
                                            <option value="Desi">Desi</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                                        <select
                                            className="input-field"
                                            value={formData.available}
                                            onChange={(e) => setFormData({...formData, available: e.target.value === 'true'})}
                                        >
                                            <option value="true">Available</option>
                                            <option value="false">Unavailable</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingFood(null);
                                        }}
                                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 btn-primary py-3"
                                    >
                                        {editingFood ? 'Update Food' : 'Add Food'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminFoods;
