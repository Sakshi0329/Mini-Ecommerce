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
                  className="card shadow-sm border-0 h-100"
                  style={{
                    borderRadius: "15px",
                  }}
                >
                  <div className="card-body">
                    <div className="text-center mb-3">
                      <span
                        className={`badge ${
                          order.orderStatus === "Delivered"
                            ? "bg-success"
                            : order.orderStatus === "Shipped"
                              ? "bg-info"
                              : order.orderStatus === "Processing"
                                ? "bg-warning text-dark"
                                : "bg-secondary"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="row text-center mb-3">
                      <div className="col-6 border-end">
                        <small className="text-muted">Payment</small>
                        <h6>{order.paymentMethod}</h6>
                      </div>

                      <div className="col-6">
                        <small className="text-muted">Total</small>
                        <h5 className="text-success">₹{order.totalAmount}</h5>
                      </div>
                    </div>

                    <hr />

                    <h6 className="fw-bold mb-3">Products</h6>

                    {(expandedProducts[order._id]
                      ? order.products
                      : order.products.slice(0, 3)
                    ).map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-3"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />

                        <div className="ms-3">
                          <h6
                            className="mb-1"
                            style={{
                              fontSize: "14px",
                            }}
                          >
                            {item.name}
                          </h6>

                          <small>
                            ₹{item.price} × {item.quantity}
                          </small>
                        </div>
                      </div>
                    ))}

                    {order.products.length > 3 && (
                      <div className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            setExpandedProducts((prev) => ({
                              ...prev,
                              [order._id]: !prev[order._id],
                            }))
                          }
                        >
                          {expandedProducts[order._id]
                            ? "Show Less ▲"
                            : `Show ${order.products.length - 3} More ▼`}
                        </button>
                      </div>
                    )}
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
