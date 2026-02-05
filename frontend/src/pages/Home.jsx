import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Shield, Heart, ChefHat, Sparkles } from 'lucide-react';

const Home = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden gradient-bg text-white">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Left Content */}
                        <div className="md:w-1/2 space-y-8 animate-slide-up">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-medium">Homemade with Love</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                Authentic
                                <span className="block text-blue-200">Homemade Food</span>
                                <span className="block text-3xl md:text-5xl mt-2">Delivered Fresh</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                                Discover delicious, healthy meals from talented home chefs in your neighborhood. 
                                Every dish is made with care, just like home.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/browse" className="group bg-white text-royal-blue px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2">
                                    Order Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/chef/dashboard" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-royal-blue transition-all duration-300 flex items-center justify-center gap-2">
                                    <ChefHat className="w-5 h-5" />
                                    Chef Panel
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 pt-8">
                                <div>
                                    <div className="text-3xl font-bold">500+</div>
                                    <div className="text-blue-200 text-sm">Home Chefs</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">10k+</div>
                                    <div className="text-blue-200 text-sm">Happy Customers</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold">4.8★</div>
                                    <div className="text-blue-200 text-sm">Average Rating</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="md:w-1/2 relative animate-scale-in">
                            <div className="relative z-10">
                                <img 
                                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                    alt="Delicious Food" 
                                    className="rounded-3xl shadow-2xl border-4 border-white/20 backdrop-blur"
                                />
                                {/* Floating Badge */}
                                <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-2xl shadow-2xl animate-bounce-slow">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-500 text-white p-3 rounded-xl">
                                            <Heart className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold">100% Fresh</div>
                                            <div className="text-sm text-gray-500">Made Today</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-slide-up">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Home Ziaka?</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Experience the perfect blend of convenience, quality, and authentic homemade taste
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Shield className="w-8 h-8" />,
                                title: "100% Hygienic",
                                description: "All chefs are verified and follow strict hygiene standards",
                                color: "bg-green-500"
                            },
                            {
                                icon: <Clock className="w-8 h-8" />,
                                title: "Fresh & Fast",
                                description: "Prepared fresh and delivered hot to your doorstep",
                                color: "bg-orange-500"
                            },
                            {
                                icon: <Heart className="w-8 h-8" />,
                                title: "Made with Love",
                                description: "Every meal is crafted with care by passionate home chefs",
                                color: "bg-red-500"
                            }
                        ].map((feature, index) => (
                            <div key={index} className="card p-8 hover:scale-105 transition-transform duration-300 animate-slide-up" style={{animationDelay: `${index * 100}ms`}}>
                                <div className={`${feature.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>









            {/* Diet Plans Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Diet Plan</h2>
                        <p className="text-gray-600 text-lg">Customized meals for your health goals</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Weight Loss', emoji: '🏃', color: 'from-pink-500 to-rose-500' },
                            { name: 'Diabetic Friendly', emoji: '💚', color: 'from-green-500 to-emerald-500' },
                            { name: 'Keto Diet', emoji: '🥑', color: 'from-purple-500 to-indigo-500' },
                            { name: 'Desi Regular', emoji: '🍛', color: 'from-orange-500 to-amber-500' }
                        ].map((plan, index) => (
                            <Link 
                                key={index} 
                                to={`/diet-meals?diet=${plan.name}`}
                                className="group relative overflow-hidden rounded-2xl p-8 text-white bg-gradient-to-br hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                                style={{background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-90`}></div>
                                <div className="relative z-10">
                                    <div className="text-5xl mb-4">{plan.emoji}</div>
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
                                        <span className="text-sm">Explore Menu</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* How it Works */}
            <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-600 text-lg">Get homemade food in 3 simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connection Lines */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-royal-blue via-royal-blue-600 to-royal-blue-700 -translate-y-1/2 z-0"></div>

                        {[
                            { step: '1', title: 'Browse & Choose', desc: 'Explore menus from verified home chefs', icon: '🔍' },
                            { step: '2', title: 'Place Order', desc: 'Select your meals and customize preferences', icon: '🛒' },
                            { step: '3', title: 'Enjoy Fresh Food', desc: 'Get hot, delicious food at your doorstep', icon: '🎉' }
                        ].map((item, index) => (
                            <div key={index} className="relative z-10 text-center">
                                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="bg-gradient-to-br from-royal-blue-500 to-royal-blue-700 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg">
                                        {item.step}
                                    </div>
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

          

            {/* CTA Section */}
            <div className="relative overflow-hidden gradient-bg py-20 text-white">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full opacity-10 blur-3xl"></div>
                </div>
                
                <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Taste the Difference?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of happy customers enjoying authentic homemade goodness every day
                    </p>
                    <Link to="/browse" className="inline-flex items-center gap-3 bg-white text-royal-blue px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-glow-lg hover:scale-105">
                        Start Ordering Now
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </div>





              {/* Developers Section */}
            <div className="py-24 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Meet Our Developers</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            The creative minds behind Home Ziaka, dedicated to bringing authentic homemade flavors to your doorstep.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                name: "Usman Ahmed",
                                role: "Frontend Developer",
                                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
                                bio: "Specializes in crafting beautiful, responsive, and performance-driven user interfaces."
                            },
                            {
                                name: "Zainab",
                                role: "Backend Developer",
                                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80",
                                bio: "Expert in building scalable server-side systems and designing robust cloud architectures."
                            },
                            {
                                name: "Mushtaq",
                                role: "UI/UX Designer",
                                image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww",
                                bio: "Passionate about creating intuitive user experiences and striking visual design systems."
                            }
                        ].map((dev, index) => (
                            <div 
                                key={index} 
                                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-slide-up"
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                <div className="relative mb-8 flex justify-center">
                                    <div className="w-32 h-32 rounded-full ring-4 ring-royal-blue/10 ring-offset-4 overflow-hidden">
                                        <img 
                                            src={dev.image} 
                                            alt={dev.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 bg-royal-blue text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                        {dev.role}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{dev.name}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {dev.bio}
                                    </p>
                                </div>
                                
                                {/* Subtle Hover Gradient Overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-royal-blue to-royal-blue-dark opacity-0 group-hover:opacity-100 transition-opacity rounded-b-3xl"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            
        </div>
    );
};

export default Home;
