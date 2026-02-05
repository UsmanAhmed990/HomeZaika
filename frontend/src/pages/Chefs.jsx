import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { MessageCircle, User, Star } from 'lucide-react';
import Chat from '../components/Chat';

const Chefs = () => {
    const [chefs, setChefs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChef, setSelectedChef] = useState(null);

    useEffect(() => {
        const fetchChefs = async () => {
            try {
                const { data } = await axios.get('/api/chef');
                setChefs(data.chefs || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching chefs:', error);
                setLoading(false);
            }
        };
        fetchChefs();
    }, []);

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-royal-blue">Home Chefs</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {chefs.map((chef) => (
                            <div key={chef._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-royal-blue/10 flex items-center justify-center">
                                    {chef.image ? (
                                        <img src={chef.image} alt={chef.user?.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={64} className="text-royal-blue/30" />
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold">{chef.user?.name || 'Chef'}</h2>
                                        <div className="flex items-center text-yellow-500">
                                            <Star size={18} fill="currentColor" />
                                            <span className="ml-1 font-semibold">4.8</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{chef.bio}</p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {chef.specialties?.split(',').map((spec, i) => (
                                            <span key={i} className="bg-royal-blue/5 text-royal-blue text-xs px-2 py-1 rounded-md">
                                                {spec.trim()}
                                            </span>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => setSelectedChef(chef)}
                                        className="w-full bg-royal-blue text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-royal-blue-dark transition"
                                    >
                                        <MessageCircle size={20} />
                                        Chat with Chef
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chat Modal/Overlay */}
            {selectedChef && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="bg-royal-blue text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                                     {selectedChef.image ? (
                                        <img src={selectedChef.image} alt={selectedChef.user?.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <span className="font-bold">{selectedChef.user?.name}</span>
                            </div>
                            <button 
                                onClick={() => setSelectedChef(null)}
                                className="hover:bg-white/10 p-1 rounded-full transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <Chat otherUserId={selectedChef.user?._id} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chefs;
