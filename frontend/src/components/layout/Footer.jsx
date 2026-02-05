const Footer = () => {
    return (
        <footer className="bg-black text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Home Ziaka</h3>
                        <p className="text-gray-400">Authentic homemade food delivered to your doorstep.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/browse" className="hover:text-white">Browse Food</a></li>
                            <li><a href="/chefs" className="hover:text-white">Our Chefs</a></li>
                            <li><a href="/about" className="hover:text-white">About Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">For Chefs</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/signup" className="hover:text-white">Join as Chef</a></li>
                            <li><a href="/chef/dashboard" className="hover:text-white">Chef Dashboard</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <p className="text-gray-400">support@homeziaka.com</p>
                        <p className="text-gray-400">+92 300 1234567</p>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
                    &copy; {new Date().getFullYear()} Home Ziaka. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
