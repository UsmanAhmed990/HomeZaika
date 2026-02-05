import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearErrors } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ChefHat, UserPlus } from 'lucide-react';

const Signup = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: 'customer'
    });

    const { name, email, role } = user;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }
    }, [dispatch, isAuthenticated, error, navigate]);

    const registerDataChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(register(user));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-royal-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-royal-blue-200 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10 animate-scale-in">
                {/* Card */}
                <div className="bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-royal-blue-600 rounded-2xl mb-4 shadow-lg">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Join Home Ziaka
                        </h2>
                        <p className="mt-2 text-gray-600">Create your account in seconds</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={submitHandler}>
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="input-field pl-12"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={registerDataChange}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="input-field pl-12"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={registerDataChange}
                                />
                            </div>
                        </div>


                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                I want to...
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setUser({...user, role: 'customer'})}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                        role === 'customer' 
                                            ? 'border-royal-blue bg-royal-blue-50 shadow-md' 
                                            : 'border-gray-200 hover:border-royal-blue-300'
                                    }`}
                                >
                                    <User className={`w-6 h-6 mx-auto mb-2 ${role === 'customer' ? 'text-royal-blue' : 'text-gray-400'}`} />
                                    <div className={`text-sm font-semibold ${role === 'customer' ? 'text-royal-blue' : 'text-gray-600'}`}>
                                        Order Food
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUser({...user, role: 'chef'})}
                                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                        role === 'chef' 
                                            ? 'border-purple-500 bg-purple-50 shadow-md' 
                                            : 'border-gray-200 hover:border-purple-300'
                                    }`}
                                >
                                    <ChefHat className={`w-6 h-6 mx-auto mb-2 ${role === 'chef' ? 'text-purple-600' : 'text-gray-400'}`} />
                                    <div className={`text-sm font-semibold ${role === 'chef' ? 'text-purple-600' : 'text-gray-600'}`}>
                                        Be a Chef
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Signup for Free
                                </>
                            )}
                        </button>
                    </form>

                </div>

                {/* Bottom Text */}
                <p className="text-center text-sm text-gray-500">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Signup;
