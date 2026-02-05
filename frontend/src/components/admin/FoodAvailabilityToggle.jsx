import { useState } from 'react';
import axios from '../../utils/axios';

const FoodAvailabilityToggle = ({ foodId, initialStatus, onUpdate }) => {
    const [isAvailable, setIsAvailable] = useState(initialStatus);
    const [loading, setLoading] = useState(false);

    const toggleAvailability = async () => {
        setLoading(true);
        try {
            const newStatus = !isAvailable;
            const { data } = await axios.put(`/api/food/${foodId}`, { available: newStatus });
            setIsAvailable(newStatus);
            if (onUpdate) onUpdate(data.food);
        } catch (error) {
            console.error('Error updating availability:', error);
            alert('Failed to update availability');
        } finally {
            setLoading(false);
        }
    };

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isAvailable}
                onChange={toggleAvailability}
                disabled={loading}
            />
            <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isAvailable ? 'peer-checked:bg-green-600' : 'peer-checked:bg-red-600'}`}></div>
            <span className={`ml-3 text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                {loading ? 'Updating...' : (isAvailable ? 'Available' : 'Unavailable')}
            </span>
        </label>
    );
};

export default FoodAvailabilityToggle;
