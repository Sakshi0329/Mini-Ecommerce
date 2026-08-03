import React, { useEffect, useState } from "react";
import { getMyOrders, deleteOrder } from "../services/api";
import Swal from "sweetalert2";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

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
  // to remove order from my orders

  //   const removeOrder = async (id) => {
  //   const result = await Swal.fire({
  //     title: "Remove Order?",
  //     text: "Are you sure you want to remove this order?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Remove",
  //     cancelButtonText: "Cancel",
  //     confirmButtonColor: "#dc3545",
  //     cancelButtonColor: "#6c757d",
  //     width: "360px",
  //   });

  //   if (!result.isConfirmed) return;

  //   try {
  //     await deleteOrder(id);

  //     await Swal.fire({
  //       icon: "success",
  //       title: "Removed!",
  //       text: "Order removed successfully.",
  //       width: "330px",
  //       timer: 1500,
  //       showConfirmButton: false,
  //     });

  //     if (selectedOrder === id) {
  //       setSelectedOrder(null);
  //     }

  //     fetchOrders();
  //   } catch (error) {
  //     console.log(error);

  //     Swal.fire({
  //       icon: "error",
  //       title: "Failed",
  //       text: "Unable to remove order.",
  //       width: "330px",
  //       confirmButtonColor: "#dc3545",
  //     });
  //   }
  // };
  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center mt-5">
          <h4 className="text-muted">No Orders Found</h4>
          <p className="text-secondary">
            Start shopping to see your orders here.
          </p>
        </div>
      ) : (
        <>
          {/* Order IDs */}
          <div className="row g-3 mb-4">
            {orders.map((order) => (
              <div className="col-lg-2 col-md-3 col-sm-4 col-6" key={order._id}>
                <div
                  className={`card text-center shadow-sm ${
                    selectedOrder === order._id
                      ? "border-primary"
                      : "border-light"
                  }`}
                  style={{
                    cursor: "pointer",
                    borderRadius: "12px",
                  }}
                  onClick={() =>
                    setSelectedOrder(
                      selectedOrder === order._id ? null : order._id,
                    )
                  }
                >
                  <div className="card-body p-2">
                    <div className="fw-bold">#{order._id.slice(-7)}</div>

                    <span
                      className={`badge mt-2 ${
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
                </div>
              </div>
            ))}
          </div>

          {/* Expanded Order */}
          {selectedOrder &&
            orders
              .filter((order) => order._id === selectedOrder)
              .map((order) => (
                <div
                  className="card shadow-sm border-0 mx-auto"
                  key={order._id}
                  style={{
                    maxWidth: "300px",
                    borderRadius: "15px",
                  }}
                >
                  <div className="card-body p-4 position-relative">
                    {/* if want to remove the cart or orders */}
                    {/* <button
                      className="btn btn-sm btn-danger position-absolute"
                      style={{
                        top: "10px",
                        right: "10px",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        padding: "0",
                        lineHeight: "1",
                      }}
                      onClick={() => removeOrder(order._id)}
                    >
                      ✕
                    </button>{" "} */}
                    {/* Payment + Total */}
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
              ))}
        </>
      )}
    </div>
  );
};

export default MyOrders;
