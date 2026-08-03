import React, { useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import API from "../services/api";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const ProductCard = ({ product, refreshProducts }) => {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: product.name,
    price: product.price,
  });

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const isAdmin = user && user.isAdmin === true;

  // 1. ORDER NOTIFY FIX
  // const handleOrderNotify = async () => {
  //   if (!token) {
  //     alert("Order karne ke liye please pehle Login karein!");
  //     return;
  //   }

  //   try {
  //     // ✅ Customer ki details localStorage se uthao
  //     const userData = JSON.parse(localStorage.getItem("user"));

  //     await API.post("/order-notify", {
  //       productName: product.name,
  //       productPrice: product.price,
  //       // ✅ Ye naya data bhejna zaroori hai
  //       customerName: userData.name,
  //       customerEmail: userData.email,
  //       customerAddress: userData.address || "Address not provided",
  //       customerPhone: userData.phone || "No contact info",
  //     });

  //     alert("✅ Order notification sent to Admin!");
  //   } catch (err) {
  //     console.error("Notification failed:", err);
  //   }
  // };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((item) => item._id === product._id);

    if (exists) {
      Swal.fire({
        icon: "info",
        title: "Already Added",
        text: "Product is already in your cart.",
        width: "340px",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));

    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: "Product added successfully.",
      width: "340px",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = wishlist.find((item) => item._id === product._id);

    if (exists) {
      wishlist = wishlist.filter((item) => item._id !== product._id);

      localStorage.setItem("wishlist", JSON.stringify(wishlist));

      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Product removed from wishlist.",
        width: "340px",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      wishlist.push(product);

      localStorage.setItem("wishlist", JSON.stringify(wishlist));

      Swal.fire({
        icon: "success",
        title: "Added to Wishlist",
        text: "Product added successfully.",
        width: "340px",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // 2. DELETE FUNCTION FIX
  const handleDelete = async (e) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Delete Product?",
      text: "You won't be able to undo this!",
      icon: "warning",
      width: "360px",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/products/${product._id}`);

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Product deleted successfully.",
        width: "340px",
        timer: 1500,
        showConfirmButton: false,
      });

      refreshProducts();
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Only admin can delete products.",
        width: "340px",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  // 3.  UPDATE FUNCTION FIX
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/products/${product._id}`, editData);

      await Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Product updated successfully.",
        width: "340px",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsEditing(false);
      refreshProducts();
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Unable to update product.",
        width: "340px",
        confirmButtonColor: "#dc3545",
      });
    }
  };
  if (isEditing) {
    // return (
    //   <div className="card">
    //     <div className="card-info">
    //       <h3>Edit Product</h3>
    //       <input
    //         type="text"
    //         value={editData.name}
    //         onChange={(e) => setEditData({ ...editData, name: e.target.value })}
    //         style={{ width: "100%", marginBottom: "10px" }}
    //       />
    //       <input
    //         type="number"
    //         value={editData.price}
    //         onChange={(e) =>
    //           setEditData({ ...editData, price: e.target.value })
    //         }
    //         style={{ width: "100%", marginBottom: "10px" }}
    //       />
    //       <button
    //         onClick={handleUpdate}
    //         className="green-btn"
    //         style={{ marginRight: "10px" }}
    //       >
    //         Update
    //       </button>
    //       <button onClick={() => setIsEditing(false)} className="logout-btn">
    //         Cancel
    //       </button>
    //     </div>
    //   </div>
    // );
  }

  return (
    <div
      className="card"
      onClick={() => navigate(`/product/${product._id}`)}
      style={{
        cursor: "pointer",
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        height: "300px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          gap: "8px",
          zIndex: 10,
        }}
      >
        <FaHeart
          size={28}
          color="#ff3b5c"
          style={{
            cursor: "pointer",
            background: "#fff",
            borderRadius: "50%",
            padding: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onClick={(e) => handleWishlist(e)}
        />

        <FaShoppingCart
          size={28}
          color="#333"
          style={{
            cursor: "pointer",
            background: "#fff",
            borderRadius: "50%",
            padding: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onClick={(e) => handleAddToCart(e)}
        />
      </div>
      <img src={product.image} alt={product.name} />
      <div className="card-info">
        <h3
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {product.name}
        </h3>
        <p>₹{product.price}</p>
        {/* <button
          className="btn btn-primary w-100 mt-2"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product._id}`);
          }}
        >
          View Product
        </button> */}
        {/* Pay Now or Close Button (Visible to All) */}
        {/* <button
          onClick={() => {
            if (!showQR) handleOrderNotify();
            setShowQR(!showQR);
          }}
          className="green-btn"
        >
          {showQR ? "Close" : "Pay Now"}
        </button> */}

        {/* --- QR Code and Admin Buttons Window (Hidden initially) --- */}
        {showQR && (
          <div className="qr-container" style={{ textAlign: "center" }}>
            {/* 1. QR Code Box (Visible to All inside the window) */}
            <div
              style={{
                background: "white",
                padding: "10px",
                borderRadius: "10px",
                marginTop: "15px",
                display: "inline-block",
              }}
            >
              <img
                src={myStaticQR}
                alt="QR Code"
                className="qr-image"
                style={{ width: "150px", height: "150px" }}
              />
            </div>
            <p
              className="upi-text"
              style={{
                marginTop: "10px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Scan & Pay ₹{product.price}
            </p>

            {/* User Notification Text */}
            <p style={{ fontSize: "10px", color: "#666", marginTop: "5px" }}>
              Scan karte hi aapka address admin ko bhej diya jayega.
            </p>

            {/* --- FIXED: Admin Buttons are back inside this window, only for Admins --- */}
            {isAdmin && (
              <div
                className="admin-controls"
                style={{
                  marginTop: "15px",
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-mini-btn"
                  style={{
                    background: "#ffc107",
                    color: "black",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="delete-mini-btn"
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
