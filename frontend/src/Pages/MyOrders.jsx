import React, { useEffect, useState } from "react";
import { getMyOrders } from "../services/api";
import Swal from "sweetalert2";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 12;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getMyOrders();
      setOrders(data.orders || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Unable to load your orders.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && orders.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Orders",
        text: "You haven't placed any orders yet.",
        confirmButtonColor: "#0d6efd",
      });
    }
  }, [loading, orders]);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-center mb-4">My Orders</h2>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center mt-5">
          <h4 className="text-muted">No Orders Found</h4>
          <p className="text-secondary">
            Start shopping to see your orders here.
          </p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {currentOrders.map((order) => (
              <div
                className="col-xl-2-4 col-lg-2-4 col-md-4 col-sm-6 col-12"
                key={order._id}
              >
                <div
                  className="card border-0 shadow-lg h-100"
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    transition: "all .3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0,0,0,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow =
                      "0 .5rem 1rem rgba(0,0,0,.15)";
                  }}
                >
                  {/* Header */}
                  <div
                    className="p-3 text-white"
                    style={{
                      background:
                        "linear-gradient(135deg,#4F46E5,#7C3AED,#9333EA)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="opacity-75">Order</small>
                        <div className="fw-bold">
                          #{order._id.slice(-6).toUpperCase()}
                        </div>
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
                    {/* Summary */}
                    <div
                      className="rounded-4 p-3 mb-3"
                      style={{ background: "#F8FAFC" }}
                    >
                      <div className="row text-center">
                        <div className="col-6 border-end">
                          <small className="text-muted d-block">Payment</small>

                          <div className="fw-semibold">
                            {order.paymentMethod}
                          </div>
                        </div>

                        <div className="col-6">
                          <small className="text-muted d-block">
                            Total Amount
                          </small>

                          <h4 className="text-success fw-bold mb-0">
                            ₹{order.totalAmount}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-bold mb-3">📦 Products</h6>

                    {(expandedProducts[order._id]
                      ? order.products
                      : order.products.slice(0, 3)
                    ).map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center rounded-4 p-2 mb-3"
                        style={{
                          background: "#fff",
                          border: "1px solid #eee",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            borderRadius: "15px",
                          }}
                        />

                        <div className="ms-3 flex-grow-1">
                          <h6
                            className="mb-1"
                            style={{
                              fontSize: "15px",
                            }}
                          >
                            {item.name}
                          </h6>

                          <div className="text-muted">₹{item.price}</div>

                          <span className="badge bg-dark mt-2">
                            Qty : {item.quantity}
                          </span>
                        </div>

                        <div
                          className="text-success fw-bold"
                          style={{ fontSize: "18px" }}
                        >
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}

                    {order.products.length > 3 && (
                      <div className="text-center mt-3">
                        <button
                          className="btn btn-dark rounded-pill px-4"
                          onClick={() =>
                            setExpandedProducts((prev) => ({
                              ...prev,
                              [order._id]: !prev[order._id],
                            }))
                          }
                        >
                          {expandedProducts[order._id]
                            ? "▲ Show Less"
                            : `▼ View ${order.products.length - 3} More`}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-footer bg-white border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {order.products.length} Item(s)
                      </small>

                      <span className="text-primary fw-semibold">
                        Thank You ❤️
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
              <button
                className="btn btn-outline-primary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>

              <span className="fw-bold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="btn btn-outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyOrders;
