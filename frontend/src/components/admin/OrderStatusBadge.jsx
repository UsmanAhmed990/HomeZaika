import { CheckCircle, Clock, Truck } from 'lucide-react';

const OrderStatusBadge = ({ status }) => {
    const getStatusStyle = () => {
        switch (status) {
            case 'Pending':
                return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock };
            case 'Delivered':
                return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle }; 
            case 'Cancelled':
                return { bg: 'bg-red-100', text: 'text-red-800', icon: Truck }; // Use Truck or XCircle for cancelled
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', icon: null };
        }
    };

    const { bg, text, icon: Icon } = getStatusStyle();

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {status}
        </span>
    );
};

export default OrderStatusBadge;
