import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../services/api";
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedProducts, setExpandedProducts] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 30;
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

      {orders.length === 0 ? (
        <h4>No Orders Found</h4>
      ) : (
        <>
          {/* Order IDs */}
          <div className="row g-3 mb-4">
            {currentOrders.map((order) => (
              <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={order._id}>
                <button
                  className={`btn w-100 ${
                    selectedOrder === order._id
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder === order._id ? null : order._id,
                    )
                  }
                >
                  #{order._id.slice(-6)}
                </button>
              </div>
            ))}
          </div>

          {/* Selected Order */}
          {selectedOrder &&
            orders
              .filter((order) => order._id === selectedOrder)
              .map((order) => (
                <div
                  key={order._id}
                  className="card shadow mx-auto"
                  style={{
                    maxWidth: "650px",
                    borderRadius: "12px",
                  }}
                >
                  <div className="card-body py-2 px-3 position-relative">
                    <button
                      className="btn btn-danger btn-sm position-absolute"
                      style={{
                        top: "10px",
                        right: "10px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        padding: "0",
                        fontWeight: "bold",
                      }}
                      onClick={() => removeOrder(order._id)}
                    >
                      ✕
                    </button>
                    <div className="row g-2">
                      {/* LEFT SIDE */}
                      <div className="col-md-6 pe-2">
                        <h5 className="fw-bold mb-2">Order Details</h5>

                        <p>
                          <strong>Order ID:</strong>
                          <br />
                          <span className="text-break">{order._id}</span>
                        </p>

                        <hr className="my-2" />

                        <h6 className="fw-bold mb-2">Customer</h6>

                        <p className="mb-0">
                          <strong>Name:</strong> {order.user?.name}
                        </p>

                        <p className="mb-1">
                          <strong>Email:</strong> {order.user?.email}
                        </p>

                        <hr />

                        <h6 className="fw-bold">Shipping Address</h6>

                        <p className="mb-0">{order.shippingAddress.fullName}</p>

                        <p className="mb-0">{order.shippingAddress.phone}</p>

                        <p className="mb-0">{order.shippingAddress.address}</p>

                        <p className="mb-0">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}
                        </p>

                        <p>{order.shippingAddress.pincode}</p>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="col-md-6 ps-2">
                        <h5 className="fw-bold mb-3">Products</h5>

                        {(expandedProducts[order._id]
                          ? order.products
                          : order.products.slice(0, 3)
                        ).map((item) => (
                          <div
                            key={item.product}
                            className="d-flex align-items-center mb-2"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                marginRight: "12px",
                              }}
                            />

                            <div>
                              <h6 className="mb-0">{item.name}</h6>

                              <small>
                                ₹{item.price} × {item.quantity}
                              </small>
                            </div>
                          </div>
                        ))}
                        {order.products.length > 3 && (
                          <div className="text-center mt-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
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

                        <div className="mb-3">
                          <h6 className="fw-bold">Payment Details</h6>

                          <p className="mb-1">
                            <strong>Method:</strong> {order.paymentMethod}
                          </p>

                          {order.paymentMethod === "COD" && (
                            <p className="text-success mb-0">
                              Cash will be collected on delivery.
                            </p>
                          )}

                          {order.paymentMethod === "UPI" && (
                            <>
                              <p className="mb-1">
                                <strong>UPI ID:</strong>{" "}
                                {order.paymentDetails?.upiId || "Not Available"}
                              </p>

                              <p className="text-success mb-0">
                                Payment via UPI
                              </p>
                            </>
                          )}

                          {order.paymentMethod === "Card" && (
                            <>
                              <p className="mb-1">
                                <strong>Card Holder:</strong>{" "}
                                {order.paymentDetails?.cardHolder ||
                                  "Not Available"}
                              </p>

                              <p className="mb-1">
                                <strong>Card Number:</strong>{" "}
                                {order.paymentDetails?.cardNumber
                                  ? "**** **** **** " +
                                    order.paymentDetails.cardNumber.slice(-4)
                                  : "Not Available"}
                              </p>

                              <p className="text-success mb-0">Card Payment</p>
                            </>
                          )}
                        </div>

                        <hr />
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <strong>Status</strong>

                          <select
                            className="form-select"
                            style={{ width: "130px", height: "35px" }}
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

                        <div className="d-flex justify-content-between">
                          <strong>Total</strong>

                          <strong className="text-success">
                            ₹{order.totalAmount}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
        </>
      )}
    </div>
  );
};

export default AdminOrders;
