import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(data);
  }, []);

  const removeItem = (id) => {
    Swal.fire({
      title: "Remove Item?",
      text: "This product will be removed from your wishlist.",
      icon: "warning",
      width: "350px",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = wishlist.filter((item) => item._id !== id);

        setWishlist(updated);

        localStorage.setItem("wishlist", JSON.stringify(updated));

        window.dispatchEvent(new Event("storage"));

        setOpenMenu(null);

        Swal.fire({
          icon: "success",
          title: "Removed",
          text: "Product removed from wishlist.",
          width: "350px",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  //   const moveToCart = (product) => {
  //     let cart = JSON.parse(localStorage.getItem("cart")) || [];

  //     const exist = cart.find((item) => item._id === product._id);

  //     if (!exist) {
  //       cart.push({
  //         ...product,
  //         quantity: 1,
  //       });

  //       localStorage.setItem("cart", JSON.stringify(cart));
  //     }

  //     removeItem(product._id);

  //     window.dispatchEvent(new Event("storage"));

  //     alert("Moved to Cart");
  //   };

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">❤ My Wishlist</h2>

      {wishlist.length === 0 ? (
        <h4 className="text-center text-muted">Wishlist is Empty</h4>
      ) : (
        <div className="row">
          {wishlist.map((item) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item._id}>
              <div
                className="card h-100 shadow-sm position-relative"
                style={{ overflow: "hidden" }}
              >
                {/* Top Right Icons */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 100,
                  }}
                >
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === item._id ? null : item._id)
                    }
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      background: "#fff",
                      cursor: "pointer",
                      fontSize: "20px",
                    }}
                  >
                    ⋮
                  </button>

                  {openMenu === item._id && (
                    <div
                      style={{
                        position: "absolute",
                        top: "42px",
                        right: 0,
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        minWidth: "150px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                      }}
                    >
                      <Link
                        to={`/product/${item._id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          textDecoration: "none",
                          color: "#000",
                        }}
                      >
                        <span>👁</span>
                        <span>View Details</span>
                      </Link>

                      <button
                        onClick={() => removeItem(item._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          width: "100%",
                          padding: "8px 12px",
                          border: "none",
                          background: "transparent",
                          color: "red",
                          cursor: "pointer",
                        }}
                      >
                        <span>🗑</span>
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                </div>

                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                <div className="card-body">
                  <h5>{item.name}</h5>

                  <h6 className="text-success">
                    ₹{item.discountPrice || item.price}
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
