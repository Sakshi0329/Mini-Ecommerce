import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 12;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await getAllOrders();
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      fetchOrders();
      alert("Order status updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const removeOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?",
    );

    if (!confirmDelete) return;

    try {
      await deleteOrder(id);

      alert("Order deleted successfully");

      fetchOrders();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete order");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">📦 Orders Dashboard</h2>

          <small className="text-muted">Manage customer orders</small>
        </div>

        <div className="badge bg-dark fs-6 p-3 rounded-pill">
          Total Orders : {orders.length}
        </div>
      </div>

      <div className="row g-4">
        {currentOrders.map((order) => (
          <div className="col-xl-4 col-lg-6 col-md-6" key={order._id}>
            <div
              className="card border-0 h-100"
              style={{
                borderRadius: "22px",
                overflow: "hidden",
                transition: ".3s",
                boxShadow: "0 12px 30px rgba(0,0,0,.08)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 22px 45px rgba(0,0,0,.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,.08)";
              }}
            >
              <button
                className="btn btn-danger position-absolute"
                style={{
                  top: 15,
                  right: 15,
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  zIndex: 10,
                }}
                onClick={() => removeOrder(order._id)}
              >
                ✕
              </button>

              <div
                className="text-white p-4"
                style={{
                  background: "linear-gradient(135deg,#2563EB,#4F46E5,#7C3AED)",
                }}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1">
                      {order.user?.name || "Customer"}
                    </h5>

                    <small>{order.user?.email}</small>
                  </div>

                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      order.orderStatus === "Delivered"
                        ? "bg-success"
                        : order.orderStatus === "Shipped"
                          ? "bg-info"
                          : order.orderStatus === "Processing"
                            ? "bg-warning text-dark"
                            : "bg-light text-dark"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="card-body">
                {/* Payment Summary */}

                <div
                  className="rounded-4 p-3 mb-4"
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div className="row text-center">
                    <div className="col-6 border-end">
                      <small className="text-muted d-block">Payment</small>

                      <h6 className="fw-bold mt-1">{order.paymentMethod}</h6>
                    </div>

                    <div className="col-6">
                      <small className="text-muted d-block">Total</small>

                      <h4 className="fw-bold text-success mb-0">
                        ₹{order.totalAmount}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}

                <div
                  className="rounded-4 p-3 mb-4"
                  style={{
                    background: "#FFF7ED",
                    border: "1px solid #FED7AA",
                  }}
                >
                  <h6 className="fw-bold mb-3">📍 Shipping Address</h6>

                  <p className="mb-1 fw-semibold">
                    {order.shippingAddress.fullName}
                  </p>

                  <small className="text-muted d-block mb-1">
                    📞 {order.shippingAddress.phone}
                  </small>

                  <small className="text-muted d-block mb-1">
                    🏠 {order.shippingAddress.address}
                  </small>

                  <small className="text-muted d-block">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    -{order.shippingAddress.pincode}
                  </small>
                </div>

                {/* Products */}

                <h5 className="fw-bold mb-3">🛍 Ordered Products</h5>

                {(expandedProducts[order._id]
                  ? order.products
                  : order.products.slice(0, 3)
                ).map((item) => (
                  <div
                    key={item.product}
                    className="d-flex align-items-center mb-3 p-2 rounded-4"
                    style={{
                      border: "1px solid #ECECEC",
                      background: "#fff",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "75px",
                        height: "75px",
                        objectFit: "cover",
                        borderRadius: "15px",
                      }}
                    />

                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-1">{item.name}</h6>

                      <small className="text-muted">₹{item.price}</small>

                      <div>
                        <span className="badge bg-dark mt-2">
                          Qty : {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="text-end">
                      <div className="fw-bold text-success">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}

                {order.products.length > 3 && (
                  <div className="text-center mb-4">
                    <button
                      className="btn btn-outline-dark rounded-pill px-4"
                      onClick={() =>
                        setExpandedProducts((prev) => ({
                          ...prev,
                          [order._id]: !prev[order._id],
                        }))
                      }
                    >
                      {expandedProducts[order._id]
                        ? "▲ Show Less"
                        : `▼ Show ${order.products.length - 3} More`}
                    </button>
                  </div>
                )}

                <hr className="my-4" />

                <h6 className="fw-bold mb-2">🚚 Update Order Status</h6>

                <select
                  className="form-select rounded-pill border-primary"
                  value={order.orderStatus}
                  onChange={(e) => changeStatus(order._id, e.target.value)}
                >
                  <option value="Pending">🟠 Pending</option>

                  <option value="Processing">🔵 Processing</option>

                  <option value="Shipped">🚚 Shipped</option>

                  <option value="Delivered">✅ Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <nav>
            <ul className="pagination shadow rounded overflow-hidden">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link px-4"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ← Previous
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link px-4"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next →
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
