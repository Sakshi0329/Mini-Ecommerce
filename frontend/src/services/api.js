import axios from "axios";

const API = axios.create({
  baseURL: "https://mini-ecommerce-4dth.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

//  Users/Auth Endpoints
export const registerUser = (userData) => API.post("/users/register", userData);
export const loginUser = (userData) => API.post("/users/login", userData);

// new OTP Verification Endpoint
export const verifyOTP = (otpData) => API.post("/users/verify-otp", otpData);

export const getProfile = () => API.get("/auth/profile");

export const updateProfile = (data) => API.put("/auth/profile", data);
// orders endpoints
export const placeOrder = (data) => API.post("/orders", data);
export const getMyOrders = () => API.get("/orders/my");
export const getAllOrders = () => API.get("/orders");
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}`, {
    orderStatus: status,
  });
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

export const sendContact = (data) => API.post("/contact", data);

export const getContacts = () => API.get("/contact");
export const deleteContact = (id) => API.delete(`/contact/${id}`);

//  Products Endpoints
export const fetchProducts = (search = "", admin = false) =>
  API.get(`/products?search=${search}&admin=${admin}`);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const updateProduct = (id, productData) =>
  API.put(`/products/${id}`, productData);

//Orders/Notifications Endpoints
export const sendOrderNotification = (orderData) =>
  API.post("/order-notify", orderData);

export default API;
