import { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders/my");
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6"></h1>

      {orders.length === 0 && (
        <p className="text-gray-500"></p>
      )}

      {orders.map(order => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
};

/* ---------------- ORDER CARD ---------------- */

const OrderCard = ({ order }) => {
  return (
    <div className="bg-white shadow rounded-xl p-5 mb-6">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Order #{order._id}</span>
        <span className="text-sm text-gray-500">
          {new Date(order.createdAt).toDateString()}
        </span>
      </div>

      <p className="text-sm mb-2">
        Status:{" "}
        <span className="font-bold text-blue-600">
          {order.status}
        </span>
      </p>

      {order.items.map(item => (
        <OrderItem
          key={item.foodId}
          item={item}
          orderStatus={order.status}
        />
      ))}

      <div className="text-right font-bold mt-4">
        Total: Rs. {order.totalPrice}
      </div>
    </div>
  );
};

/* ---------------- ORDER ITEM ---------------- */

const OrderItem = ({ item, orderStatus }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [rated, setRated] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const submitRating = async (value) => {
    try {
      await axios.post("/api/ratings", {
        foodId: item.foodId,
        rating: value,
      });
      setRating(value);
      setRated(true);
    } catch (error) {
      console.error(error);
    }
  };

  const submitReview = async () => {
    if (!review) return;

    try {
      await axios.post("/api/reviews", {
        foodId: item.foodId,
        review,
      });
      setReviewed(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-500">
            Qty: {item.quantity}
          </p>
        </div>
        <p className="font-bold">Rs. {item.price}</p>
      </div>

      {/* ⭐ RATING */}
      {orderStatus === "Delivered" && (
        <div className="mt-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                disabled={rated}
                onClick={() => submitRating(star)}
                className={`text-2xl ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {rated && (
            <p className="text-sm text-green-600 mt-1">
              Rating submitted ✔
            </p>
          )}

          {/* 📝 REVIEW */}
          <textarea
            className="w-full border rounded-lg p-2 text-sm mt-3"
            placeholder="Write your remarks (optional)..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            disabled={reviewed}
          />

          <button
            onClick={submitReview}
            disabled={reviewed}
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-lg text-sm"
          >
            Submit Review
          </button>

          {reviewed && (
            <p className="text-green-600 text-sm mt-1">
              Review submitted ✔
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
