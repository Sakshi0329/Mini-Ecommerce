import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactLayout } from "./Components/ReactLayout";
// import { Home } from "./pages/Home";
import { About } from "./Pages/About";
import { Contact } from "./Pages/Contact";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import { Home } from "./Pages/Home";
import AddProduct from "./Pages/AddProduct";
import Products from "./Pages/Product";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";
import Checkout from "./Pages/Checkout";
import MyOrders from "./Pages/MyOrders";
import AdminOrders from "./Pages/AdminOrders";
import AdminContacts from "./Pages/AdminContact";
import AdminProducts from "./Pages/AdminProducts";
import EditProduct from "./Pages/EditProduct";

export const App = () => {
  const [user, setUser] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReactLayout user={user} setUser={setUser} />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="product" element={<Products />} />
          <Route path="admin/product" element={<AdminProducts />} />
          <Route
            path="/admin/edit-product/:id"
            element={
              token && role === "admin" ? (
                <EditProduct />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route
            path="/admin/contacts"
            element={
              token && role === "admin" ? (
                <AdminContacts />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/admin/orders" element={<AdminOrders />} />

          <Route path="contact" element={<Contact />} />
          <Route
            path="register"
            element={
              !user ? (
                <Register
                  setUser={setRegisteredUser}
                  setStatusMessage={setStatusMessage}
                />
              ) : (
                <Navigate to="/profile" />
              )
            }
          />
          <Route
            path="login"
            element={
              !user ? (
                <Login
                  registeredUser={registeredUser}
                  setUser={setUser}
                  setStatusMessage={setStatusMessage}
                />
              ) : (
                <Navigate to="/profile" />
              )
            }
          />

          <Route
            path="admin"
            element={
              token && role === "admin" ? (
                <AddProduct />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="profile"
            element={
              user ? (
                <Profile user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
