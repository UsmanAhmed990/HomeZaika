import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';
import { ShoppingBag, User, LogOut, Menu, X, ChefHat, Shield } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { cartItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl me-4 font-extrabold tracking-tight text-blue-600 hover:text-blue-700 transition"
          >
            Home<span className="text-black">Ziaka</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link style={{fontWeight : 'bold'}} className="nav-link" to="/browse">Browse Food</Link>
            {/* <Link style={{fontWeight : 'bold'}} className="nav-link" to="/diet-meals">Diet Meals</Link> */}
            {/* <Link style={{fontWeight : 'bold'}} className="nav-link" to="/chefs">Home Chefs</Link> */}

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <ShoppingBag className="w-6 h-6 text-gray-800 group-hover:text-blue-600 transition" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Auth (Signup Only) */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 font-bold hover:text-blue-600 transition">Login</Link>
                <Link to="/signup" className="btn-primary px-6 py-2 rounded-full">Signup for Free</Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Welcome, {user.name}</span>
                {/* <Link to="/profile" className="text-gray-700 font-bold hover:text-blue-600 transition">Profile</Link> */}
              </div>
            )}

            {/* Private Portal Gate */}
            <div className="relative group">
              <button 
                onClick={() => {
                  if (!sessionStorage.getItem('admin_passcode')) {
                    const pass = prompt('Enter Admin Passcode for Private Portal access:');
                    if (pass === 'admin123') {
                      sessionStorage.setItem('admin_passcode', pass);
                      window.location.reload();
                    } else if (pass !== null) {
                      alert('Invalid Passcode - Staff Only');
                    }
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-300 border border-blue-100"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <User className="w-5 h-5" />
                </div>
                <span className="font-bold whitespace-nowrap">
                  {sessionStorage.getItem('admin_passcode') ? 'Admin Access' : 'Private Portal'}
                </span>
                {!sessionStorage.getItem('admin_passcode') && <Shield className="w-3 h-3 text-red-500 animate-pulse" />}
              </button>

              {/* Dropdown - Only visible if unlocked */}
              {sessionStorage.getItem('admin_passcode') && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-80">Admin Access</p>
                      <p className="text-sm font-medium">Unlocked</p>
                    </div>
                    <button 
                      onClick={() => {
                        sessionStorage.removeItem('admin_passcode');
                        window.location.reload();
                      }}
                      className="p-1 hover:bg-white/20 rounded-lg transition"
                      title="Lock"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                  
                  <div className="p-2">
                    {/* <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-xl transition-colors group/item" to="/profile">
                      <User className="w-4 h-4 text-blue-500 group-hover/item:scale-110 transition-transform" /> 
                      <span className="font-semibold">My Profile</span>
                    </Link> */}
                    {/* <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-xl transition-colors group/item" to="/orders">
                      <ShoppingBag className="w-4 h-4 text-green-500 group-hover/item:scale-110 transition-transform" /> 
                      <span className="font-semibold">My Orders</span>
                    </Link> */}
                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                    <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-xl transition-colors group/item" to="/chef/dashboard">
                      <ChefHat className="w-4 h-4 text-orange-500 group-hover/item:scale-110 transition-transform" />
                      <span className="font-semibold">Chef Dashboard</span>
                    </Link>
                    <Link className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 rounded-xl transition-colors group/item" to="/admin/dashboard">
                      <Shield className="w-4 h-4 text-purple-500 group-hover/item:scale-110 transition-transform" /> 
                      <span className="font-semibold">Admin Dashboard</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="space-y-1 px-4 py-4">
            <MobileLink to="/browse" onClick={setIsMenuOpen}>Browse Food</MobileLink>
            <MobileLink to="/chefs" onClick={setIsMenuOpen}>Home Chefs</MobileLink>
            <MobileLink to="/cart" onClick={setIsMenuOpen}>
              Cart ({cartItems.length})
            </MobileLink>

            <div className="h-px bg-gray-100 my-2 mx-4"></div>

            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-4 px-4 py-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl border border-gray-200 font-bold text-gray-700 active:bg-gray-50 transition"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center py-3 rounded-xl bg-blue-600 font-bold text-white active:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-bold hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}

            <div className="h-px bg-gray-100 my-2 mx-4"></div>

            {!sessionStorage.getItem('admin_passcode') ? (
              <button 
                onClick={() => {
                  const pass = prompt('Enter Admin Passcode for Staff Access:');
                  if (pass === 'admin123') {
                    sessionStorage.setItem('admin_passcode', pass);
                    window.location.reload();
                  } else if (pass !== null) {
                    alert('Invalid Passcode');
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-600 bg-blue-50 font-bold hover:bg-blue-100 transition"
              >
                <Shield className="w-4 h-4" />
                Staff/Admin Login
              </button>
            ) : (
              <div className="bg-blue-50/50 rounded-2xl p-2 space-y-1">
                <div className="flex justify-between items-center px-4 py-2">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Admin Dashboards</p>
                  <button 
                    onClick={() => {
                      sessionStorage.removeItem('admin_passcode');
                      window.location.reload();
                    }}
                    className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-gray-200 text-gray-500 font-bold"
                  >
                    LOCK
                  </button>
                </div>
                <MobileLink to="/profile" onClick={setIsMenuOpen} icon={<User className="w-4 h-4" />}>Profile</MobileLink>
                <MobileLink to="/orders" onClick={setIsMenuOpen} icon={<ShoppingBag className="w-4 h-4" />}>My Orders</MobileLink>
                <MobileLink to="/chef/dashboard" onClick={setIsMenuOpen} icon={<ChefHat className="w-4 h-4" />}>Chef Dashboard</MobileLink>
                <MobileLink to="/admin/dashboard" onClick={setIsMenuOpen} icon={<Shield className="w-4 h-4" />}>Admin Dashboard</MobileLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

/* =====================
   Reusable styles
===================== */
const MobileLink = ({ to, children, onClick, icon }) => (
  <Link
    to={to}
    onClick={() => onClick(false)}
    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all duration-200"
  >
    <span className="text-blue-500">{icon}</span>
    <span className="font-semibold">{children}</span>
  </Link>
);

export default Navbar;
