import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../services/api";
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

      if (selectedOrder === id) {
        setSelectedOrder(null);
      }

      fetchOrders();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete order");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">All Orders</h2>
      <>
        <div className="row g-4">
          {currentOrders.map((order) => (
            <div
              className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
              key={order._id}
            >
              <div
                className="card shadow-sm border-0 h-100 position-relative"
                style={{ borderRadius: "15px" }}
              >
                <button
                  className="btn btn-danger btn-sm position-absolute"
                  style={{
                    top: "10px",
                    right: "10px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    padding: "0",
                    zIndex: 10,
                  }}
                  onClick={() => removeOrder(order._id)}
                >
                  ✕
                </button>

                <div className="card-body">
                  <div className="row">
                    {/* LEFT SIDE */}
                    <div className="col-md-6 border-end">
                      <h5 className="fw-bold mb-3">
                        {order.user?.name || "Customer"}
                      </h5>

                      <p className="mb-1">
                        <strong>Email:</strong>
                        <br />
                        {order.user?.email}
                      </p>

                      <hr />

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

                      <h6 className="fw-bold">Shipping</h6>

                      <p className="mb-1">{order.shippingAddress.fullName}</p>

                      <p className="mb-1">{order.shippingAddress.phone}</p>

                      <p className="mb-1">{order.shippingAddress.address}</p>

                      <p className="mb-1">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                      </p>

                      <p className="mb-0">{order.shippingAddress.pincode}</p>
                    </div>

                    {/* RIGHT SIDE */}

                    <div className="col-md-6">
                      <h5 className="fw-bold mb-3">Products</h5>

                      {(expandedProducts[order._id]
                        ? order.products
                        : order.products.slice(0, 3)
                      ).map((item) => (
                        <div
                          key={item.product}
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
                            <h6 className="mb-1">{item.name}</h6>

                            <small>
                              ₹{item.price} × {item.quantity}
                            </small>
                          </div>
                        </div>
                      ))}

                      {order.products.length > 3 && (
                        <div className="text-center mb-3">
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

                      <hr />

                      <h6 className="fw-bold">Order Status</h6>

                      <select
                        className="form-select"
                        value={order.orderStatus}
                        onChange={(e) =>
                          changeStatus(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
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
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </>
    </div>
  );
};

export default AdminOrders;
