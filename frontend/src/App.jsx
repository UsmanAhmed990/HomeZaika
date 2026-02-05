import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Browse from './pages/Browse';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import ChefDashboard from './pages/ChefDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminFoods from './pages/AdminFoods';
import Chefs from './pages/Chefs';
import DietMeals from './pages/DietMeals';
import PrivateRoute from './components/route/PrivateRoute';
import AuthRoute from './components/route/AuthRoute';

// Placeholder Pages
const Dashboard = () => <div className="min-h-screen pt-20 px-8"><h1 className="text-3xl font-bold">User Dashboard</h1></div>;

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes (Require Login) */}
          <Route path="/browse" element={<AuthRoute><Browse /></AuthRoute>} />
          <Route path="/cart" element={<AuthRoute><Cart /></AuthRoute>} />
          <Route path="/chefs" element={<AuthRoute><Chefs /></AuthRoute>} />
          <Route path="/diet-meals" element={<AuthRoute><DietMeals /></AuthRoute>} />
          <Route path="/profile" element={<AuthRoute><Dashboard /></AuthRoute>} />
          <Route path="/checkout" element={<AuthRoute><Checkout /></AuthRoute>} />
          <Route path="/orders" element={<AuthRoute><Orders /></AuthRoute>} />
          
          {/* Admin Routes (Require Login + Passcode Gate) */}
          <Route path="/chef/dashboard" element={<AuthRoute><PrivateRoute><ChefDashboard /></PrivateRoute></AuthRoute>} />
          <Route path="/admin/dashboard" element={<AuthRoute><PrivateRoute><AdminDashboard /></PrivateRoute></AuthRoute>} />
          <Route path="/admin/orders" element={<AuthRoute><PrivateRoute><AdminOrders /></PrivateRoute></AuthRoute>} />
          <Route path="/admin/foods" element={<AuthRoute><PrivateRoute><AdminFoods /></PrivateRoute></AuthRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
