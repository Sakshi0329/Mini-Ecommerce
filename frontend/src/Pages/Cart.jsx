import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);

    setCart(updated);

    localStorage.setItem("cart", JSON.stringify(updated));

    window.dispatchEvent(new Event("storage"));
  };

  const changeQty = (id, type) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        if (type === "inc") item.quantity += 1;
        if (type === "dec" && item.quantity > 1) item.quantity -= 1;
      }
      return item;
    });

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      (item.discountPrice > 0 ? item.discountPrice : item.price) *
        item.quantity,
    0,
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">🛒 My Cart</h2>

      {cart.length === 0 ? (
        <h4 className="text-center text-muted">Cart is Empty</h4>
      ) : (
        <div className="row">
          {/* LEFT SIDE - Cart Products */}
          <div className="col-lg-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="card shadow-sm mb-3 position-relative"
                style={{
                  borderRadius: "18px",
                  padding: "18px 50px 18px 90px",
                }}
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item._id)}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "15px",
                    border: "none",
                    background: "transparent",
                    color: "red",
                    fontSize: "30px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>

                <div
                  className="d-flex align-items-center"
                  style={{ gap: "30px" }}
                >
                  {/* Image */}
                  <div style={{ width: "120px" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  {/* Product */}
                  <div
                    style={{
                      width: "320px",
                    }}
                  >
                    <h5
                      style={{
                        marginBottom: "10px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </h5>

                    <h5 className="text-success m-0">
                      ₹{item.discountPrice || item.price}
                    </h5>
                  </div>

                  {/* Quantity */}
                  <div
                    className="d-flex align-items-center"
                    style={{ width: "150px", gap: "12px" }}
                  >
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => changeQty(item._id, "dec")}
                    >
                      -
                    </button>

                    <strong>{item.quantity}</strong>

                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => changeQty(item._id, "inc")}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div className="col-lg-5">
            <div
              className="card shadow-sm"
              style={{
                position: "sticky",
                top: "100px",
              }}
            >
              <div className="card-body">
                <h4 className="fw-bold mb-4">Price Details</h4>

                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between mb-2"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      ₹{(item.discountPrice || item.price) * item.quantity}
                    </span>
                  </div>
                ))}

                <hr />

                <div className="d-flex justify-content-between">
                  <h5>Total</h5>

                  <h5 className="text-success">₹{total}</h5>
                </div>

                <button
                  className="btn btn-success w-100 mt-4"
                  onClick={() => {
                    if (!user) {
                      Swal.fire({
                        icon: "warning",
                        title: "Login Required",
                        text: "Please login first.",
                        confirmButtonColor: "#198754",
                        width: "350px",
                      }).then(() => {
                        navigate("/login");
                      });

                      return;
                    }

                    if (user.role === "Admin" || user.role === "admin") {
                      Swal.fire({
                        icon: "error",
                        title: "Access Denied",
                        text: "Admin cannot place orders.",
                        confirmButtonColor: "#dc3545",
                        width: "350px",
                      });

                      return;
                    }

                    navigate("/checkout");
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
