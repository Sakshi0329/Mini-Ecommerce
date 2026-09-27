import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Users/Auth Endpoints
export const registerUser = (userData) =>
  API.post("/api/users/register", userData);
export const loginUser = (userData) => API.post("/api/users/login", userData);

// OTP Verification Endpoint
export const verifyOTP = (otpData) =>
  API.post("/api/users/verify-otp", otpData);

export const getProfile = () => API.get("/api/auth/profile");
export const updateProfile = (data) => API.put("/api/auth/profile", data);

// Orders Endpoints
export const placeOrder = (data) => API.post("/api/orders", data);
export const getMyOrders = () => API.get("/api/orders/my");
export const getAllOrders = () => API.get("/api/orders");
export const updateOrderStatus = (id, status) =>
  API.put(`/api/orders/${id}`, {
    orderStatus: status,
  });
export const deleteOrder = (id) => API.delete(`/api/orders/${id}`);

// Contact Endpoints
export const sendContact = (data) => API.post("/api/contact", data);
export const getContacts = () => API.get("/api/contact");
export const deleteContact = (id) => API.delete(`/api/contact/${id}`);

// Products Endpoints
export const fetchProducts = (search = "", admin = false) =>
  API.get(`/api/products?search=${search}&admin=${admin}`);
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);
export const updateProduct = (id, productData) =>
  API.put(`/api/products/${id}`, productData);

// Orders/Notifications Endpoints
export const sendOrderNotification = (orderData) =>
  API.post("/api/order-notify", orderData);

export default API;
