import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import { ArrowLeft, Flame, Clock, Apple } from 'lucide-react';

const dietMealsData = [
    // Weight Loss
    { id: 1, name: 'Quinoa Salad with Grilled Chicken', category: 'Weight Loss', calories: 350, price: 450, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', chef: 'chef1' },
    { id: 2, name: 'Zucchini Noodles with Pesto', category: 'Weight Loss', calories: 280, price: 380, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800', chef: 'chef1' },
    { id: 3, name: 'Baked Salmon with Steamed Broccoli', category: 'Weight Loss', calories: 420, price: 650, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800', chef: 'chef1' },
    
    // Diabetic Friendly
    { id: 4, name: 'Lentil Soup (Daal)', category: 'Diabetic Friendly', calories: 220, price: 250, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800', chef: 'chef2' },
    { id: 5, name: 'Roasted Turkey with Green Beans', category: 'Diabetic Friendly', calories: 310, price: 550, image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800', chef: 'chef2' },
    { id: 6, name: 'Cauliflower Fried Rice', category: 'Diabetic Friendly', calories: 240, price: 320, image: 'https://images.unsplash.com/photo-1512058560550-42749359a787?w=800', chef: 'chef2' },

    // Keto Diet
    { id: 7, name: 'Avocado and Egg Salad', category: 'Keto Diet', calories: 450, price: 350, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', chef: 'chef3' },
    { id: 8, name: 'Grilled Steak with Butter', category: 'Keto Diet', calories: 680, price: 850, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800', chef: 'chef3' },
    { id: 9, name: 'Cheese Stuffed Chicken Breast', category: 'Keto Diet', calories: 550, price: 580, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800', chef: 'chef3' },

    // Desi Regular
    { id: 10, name: 'Chicken Biryani', category: 'Desi Regular', calories: 850, price: 450, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800', chef: 'chef4' },
    { id: 11, name: 'Mutton Karahi', category: 'Desi Regular', calories: 920, price: 750, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800', chef: 'chef4' },
    { id: 12, name: 'Haleem with Naan', category: 'Desi Regular', calories: 780, price: 400, image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800', chef: 'chef4' }
];

const DietMeals = () => {
    const [searchParams] = useSearchParams();
    const selectedDiet = searchParams.get('diet');
    const dispatch = useDispatch();

    const filteredMeals = dietMealsData.filter(
        meal => meal.category.toLowerCase() === selectedDiet?.toLowerCase()
    );

    const handleAddToCart = (meal) => {
        dispatch(addToCart({
            food: meal.id,
            name: meal.name,
            price: meal.price,
            image: meal.image,
            quantity: 1,
            chef: meal.chef
        }));
    };

    const getDietStyles = (diet) => {
        switch (diet?.toLowerCase()) {
            case 'weight loss': return 'from-pink-500 to-rose-500 text-white';
            case 'diabetic friendly': return 'from-green-500 to-emerald-500 text-white';
            case 'keto diet': return 'from-purple-500 to-indigo-500 text-white';
            case 'desi regular': return 'from-orange-500 to-amber-500 text-white';
            default: return 'from-royal-blue to-royal-blue-dark text-white';
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className={`rounded-3xl p-8 md:p-12 bg-gradient-to-r ${getDietStyles(selectedDiet)} shadow-2xl mb-12`}>
                    <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{selectedDiet} Plan</h1>
                    <p className="text-lg opacity-90 max-w-2xl">
                        Expertly curated meals designed for your Specific health needs. 
                        Healthy, delicious, and made fresh for you.
                    </p>
                </div>

                {/* Grid */}
                {filteredMeals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredMeals.map((meal) => (
                            <div key={meal.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="relative h-56">
                                    <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Apple size={14} className="text-green-500" />
                                        {meal.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-3">{meal.name}</h3>
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Flame size={18} className="text-orange-500" />
                                            <span className="text-sm">{meal.calories} kcal</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock size={18} className="text-blue-500" />
                                            <span className="text-sm">Fresh Today</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-royal-blue">Rs. {meal.price}</span>
                                        <button 
                                            onClick={() => handleAddToCart(meal)}
                                            className="bg-royal-blue text-white px-6 py-2 rounded-xl font-bold hover:bg-royal-blue-dark transition shadow-md active:scale-95 transition-transform"
                                        >
                                            Order Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-500">No meals found for this plan.</h2>
                        <Link to="/" className="text-royal-blue font-bold mt-4 inline-block underline">
                            Go back to select another plan
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DietMeals;
