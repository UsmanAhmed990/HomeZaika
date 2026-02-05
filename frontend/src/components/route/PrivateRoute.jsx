import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
    const [isUnlocked, setIsUnlocked] = useState(!!sessionStorage.getItem('admin_passcode'));
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // For now, let's use a simple password check as requested
    const ADMIN_PASSWORD = 'admin123'; 

    const handleUnlock = (e) => {
        e.preventDefault();
        const trimPassword = password.trim();
        if (trimPassword === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_passcode', trimPassword);
            setIsUnlocked(true);
        } else {
            setError('Invalid Admin Password');
        }
    };

    const handleLock = () => {
        sessionStorage.removeItem('admin_passcode');
        setIsUnlocked(false);
        setPassword('');
    };

    if (isUnlocked) {
        return (
            <div className="relative">
                {/* Admin Mode Indicator */}
                <div className="fixed top-20 right-8 z-[100] animate-bounce-in">
                    <button 
                        onClick={handleLock}
                        className="bg-royal-blue text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 hover:bg-royal-blue-dark transition-all"
                    >
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        Admin Mode: Unlocked
                        <span className="opacity-60 text-xs ml-2">Click to Lock</span>
                    </button>
                </div>
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-royal-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-royal-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Restricted Access</h2>
                    <p className="text-gray-500 mt-3 font-medium">Enter your admin passcode to proceed</p>
                </div>

                <form onSubmit={handleUnlock} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Admin Passcode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="••••••••"
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-royal-blue focus:ring-4 focus:ring-royal-blue/5 outline-none transition-all duration-300 text-center text-2xl tracking-[0.5em] placeholder:tracking-normal placeholder:text-gray-200"
                            autoFocus
                        />
                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-sm mt-3 ml-1 font-bold animate-shake">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                {error}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-royal-blue text-white py-4 rounded-2xl font-black text-lg hover:bg-royal-blue-dark transition-all transform active:scale-95 shadow-xl shadow-royal-blue/20 flex items-center justify-center gap-3 group"
                    >
                        Unlock Dashboard
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    
                    <p className="text-center text-xs text-gray-400 font-medium">
                        Session will persist until manual lock
                    </p>
                </form>
            </div>
        </div>
    );
};

export default PrivateRoute;
