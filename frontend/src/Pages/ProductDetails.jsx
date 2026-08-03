import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
    relatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const relatedProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exist = cart.find((item) => item._id === product._id);

    if (exist) {
      Swal.fire({
        icon: "info",
        title: "Already in Cart",
        text: "This product is already added to your cart.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const cartItem = {
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity: 1,
      inStock: product.inStock,
    };

    cart.push(cartItem);

    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("storage"));

    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: `${product.name} has been added to your cart.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const addWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const exist = wishlist.find((item) => item._id === product._id);

    if (exist) {
      Swal.fire({
        icon: "info",
        title: "Already in Wishlist",
        text: "This product is already added to your wishlist.",
        confirmButtonColor: "#dc3545",
      });
      return;
    }

    const wishlistItem = {
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      discountPrice: product.discountPrice,
      inStock: product.inStock,
    };

    wishlist.push(wishlistItem);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    window.dispatchEvent(new Event("storage"));

    Swal.fire({
      icon: "success",
      title: "Added to Wishlist ❤️",
      text: `${product.name} added successfully.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (!product) return <h2>Loading...</h2>;

  const discount =
    product.discountPrice > 0
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : 0;

  return (
    <div className="container py-5">
      <div
        style={{
          display: "flex",
          gap: "60px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Left Image */}
        <div
          style={{
            position: "relative",
            width: "300px",
            height: "410px",
            background: "#fff",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 5px 20px rgba(0,0,0,0.12)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Stock Ribbon */}
          <div
            style={{
              position: "absolute",
              top: "22px",
              right: "-45px",
              width: "170px",
              textAlign: "center",
              background: product.inStock ? "#28a745" : "#dc3545",
              color: "#fff",
              padding: "8px 0",
              fontWeight: "600",
              fontSize: "14px",
              transform: "rotate(45deg)",
              zIndex: 2,
              boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
            }}
          >
            {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
          </div>

          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              //   padding: "20px",
            }}
          />
        </div>

        {/* Right Details */}
        <div style={{ flex: 1 }}>
          <span className="badge bg-primary mb-2" style={{ fontSize: "14px" }}>
            {product.category}
          </span>

          <h2 style={{ fontWeight: "700" }}>{product.name}</h2>

          {/* Price */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              margin: "20px 0",
            }}
          >
            <h1
              style={{
                color: "#16a34a",
                margin: 0,
                fontWeight: "700",
              }}
            >
              ₹{product.discountPrice || product.price}
            </h1>

            {product.discountPrice > 0 && (
              <>
                <h3
                  style={{
                    color: "#777",
                    textDecoration: "line-through",
                    margin: 0,
                  }}
                >
                  ₹{product.price}
                </h3>

                <span
                  style={{
                    background: "#ffe4e6",
                    color: "#dc2626",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontWeight: "600",
                  }}
                >
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Quantity */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <label style={{ fontWeight: "600", margin: 0 }}>Quantity</label>

            <input
              type="number"
              defaultValue={1}
              min={1}
              style={{
                width: "70px",
                height: "40px",
                textAlign: "center",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          {/* Description */}

          <p
            style={{
              color: "#555",
              lineHeight: "30px",
              fontSize: "15px",
              marginTop: "20px",
            }}
          >
            {product.description}
          </p>

          {/* Buttons */}

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "35px",
              flexWrap: "nowrap",
            }}
          >
            <button
              className="btn btn-outline-primary"
              style={{
                // padding: "12px 30px",
                borderRadius: "12px",
              }}
              onClick={addToCart}
            >
              🛒︎ Add to Cart
            </button>

            <button
              className="btn btn-outline-danger"
              style={{
                // padding: "12px 30px",
                borderRadius: "12px",
              }}
              onClick={addWishlist}
            >
              ❤ Wishlist
            </button>

            <button
              className={`btn ${
                product.inStock ? "btn-outline-success" : "btn-secondary"
              }`}
              disabled={!product.inStock}
              onClick={() => {
                Swal.fire({
                  icon: "success",
                  title: "Proceeding to Checkout",
                  text: "Redirecting to checkout page...",
                  showConfirmButton: false,
                  timer: 1200,
                });
              }}
              style={{
                padding: "12px 30px",
                borderRadius: "12px",
              }}
            >
              {product.inStock ? "Buy Now" : "Out Of Stock"}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h3 className="mb-4 fw-bold">Related Products</h3>

        <Slider {...settings}>
          {products
            .filter((item) => item._id !== product._id)
            .map((item) => (
              <div key={item._id} className="p-2">
                <Link
                  to={`/product/${item._id}`}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <div
                    style={{
                      border: "1px solid #eee",
                      borderRadius: "15px",
                      padding: "15px",
                      textAlign: "center",
                      background: "#fff",
                      cursor: "pointer",
                      height: "320px",
                      transition: "0.3s",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />

                    <h6 className="mt-3">{item.name}</h6>

                    <h5 style={{ color: "green" }}>
                      ₹{item.discountPrice || item.price}
                    </h5>

                    <button
                      className="btn btn-outline-primary btn-sm mt-2"
                      style={{ borderRadius: "8px" }}
                    >
                      View Product
                    </button>
                  </div>
                </Link>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default ProductDetails;
