import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../features/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const { cartItems } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const deliveryFee = subtotal > 0 ? 150 : 0;
    const total = subtotal + deliveryFee;

    const handleQuantityChange = (food, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ food, quantity: newQuantity }));
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login?redirect=checkout');
            return;
        }
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white py-20">
                <div className="text-center animate-scale-in">
                    <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-16 h-16 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
                    <Link to="/browse" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" />
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 animate-slide-up">
                    <Link to="/browse" className="text-royal-blue flex items-center gap-2 hover:gap-3 transition-all mb-4">
                        <ArrowLeft className="w-5 h-5" />
                        Continue Shopping
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3 space-y-4">
                        {cartItems.map((item, index) => (
                            <div 
                                key={item.food} 
                                className="card p-6 hover:shadow-xl transition-all animate-slide-up"
                                style={{animationDelay: `${index * 50}ms`}}
                            >
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Image */}
                                    <div className="w-full sm:w-32 h-32 flex-shrink-0">
                                        <img 
                                            src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
                                            }}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-xl text-gray-900 mb-2">{item.name}</h3>
                                        <p className="text-2xl font-bold text-royal-blue mb-4">Rs. {item.price}</p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                                <button
                                                    onClick={() => handleQuantityChange(item.food, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-md hover:bg-royal-blue hover:text-white transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.food, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-md hover:bg-royal-blue hover:text-white transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="text-gray-600">
                                                Subtotal: <span className="font-bold text-gray-900">Rs. {item.quantity * item.price}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => dispatch(removeFromCart(item.food))}
                                        className="self-start p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Clear Cart */}
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to clear your cart?')) {
                                    dispatch(clearCart());
                                }
                            }}
                            className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 mt-4"
                        >
                            <Trash2 className="w-4 h-4" />
                            Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="card p-6 sticky top-24 animate-scale-in">
                            <h2 className="text-2xl font-bold mb-6 text-gray-900">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="font-semibold text-gray-900">Rs. {subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="font-semibold text-gray-900">Rs. {deliveryFee}</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-royal-blue">Rs. {total}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full btn-primary py-4 text-lg"
                            >
                                Proceed to Checkout
                            </button>

                            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-800 font-medium">
                                    ✓ Free delivery on orders above Rs. 1000
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
