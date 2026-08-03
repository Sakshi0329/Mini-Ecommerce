import React, { useCallback, useEffect, useState } from "react";
import Slider from "react-slick";
import { useLocation } from "react-router";
import { fetchProducts } from "../services/api";
import ProductCard from "../Components/ProductCard";

import Beauty from "../Image/Beauty.jpg";
import Accessories from "../Image/Accessories.avif";
import Electronic from "../Image/Electronic.avif";
import Fashion from "../Image/Fashion.png";
import Food from "../Image/Food.png";

import Grosery from "../Image/Grosery.webp";
import Kitchen from "../Image/Kitchen.png";
import Footwear from "../Image/Footwear.png";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Img1 from "../Image/Imgs1.jpg";
import Img2 from "../Image/Imgs2.jpg";
import Img3 from "../Image/imag1.webp";
import Img4 from "../Image/imag2.webp";
import Swal from "sweetalert2";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  const [allImageIndex, setAllImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAllImageIndex((prev) => (prev + 1) % categoryList.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const location = useLocation();

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);

      const searchParams = new URLSearchParams(location.search);
      const searchQuery = searchParams.get("search") || "";

      const { data } = await fetchProducts(searchQuery);

      // console.log("Products:", data);

      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Unable to load products.",
        width: "350px",
        padding: "1.5rem",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // useEffect(() => {
  //   if (!loading && products.length === 0) {
  //     Swal.fire({
  //       icon: "info",
  //       title: "No Products",
  //       text: "No products found.",
  //       width: "350px",
  //       confirmButtonColor: "#0d6efd",
  //     });
  //   }
  // }, [loading, products]);

  const bannerSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 700,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const categorySettings = {
    dots: false,
    infinite: true,
    autoplay: false,
    // autoplaySpeed: 2500,
    speed: 600,
    slidesToShow: 8,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  const categoryList = [
    // { name: "All", image: Fashion },
    { name: "Fashion", image: Fashion },
    { name: "Electronics", image: Electronic },
    { name: "Beauty", image: Beauty },
    { name: "Groceries", image: Grosery },
    { name: "Footwear", image: Footwear },
    { name: "Accessories", image: Accessories },
    { name: "Food", image: Food },
    { name: "Kitchen", image: Kitchen },
  ];
  const categories = [
    {
      name: "All",
      image: categoryList[allImageIndex].image,
    },
    ...categoryList,
  ];

  return (
    <div className="container-fluid px-3 mt-4">
      {/* <div
        style={{
          padding: "0 95px", // Increase left & right space
          marginBottom: "30px",
        }}
      >
        <Slider {...categorySettings}>
          {categories.map((category) => (
            <div key={category.name} style={{ padding: "0" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "2px", // Less space between items
                }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                  }}
                />
                <p
                  style={{
                    marginTop: "6px",
                    fontSize: "13px",
                    marginBottom: 0,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {category.name}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div> */}

      {isMobile ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "15px",
            marginBottom: "20px",
            padding: "0 10px",
          }}
        >
          {categories.map((category) => (
            <div
              key={category.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #ddd",
                }}
              />

              <p
                style={{
                  marginTop: "6px",
                  marginBottom: 0,
                  fontSize: "12px",
                  textAlign: "center",
                }}
              >
                {category.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "0 15px",
            marginBottom: "30px",
          }}
        >
          <Slider {...categorySettings}>
            {categories.map((category) => (
              <div key={category.name}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #ddd",
                    }}
                  />

                  <p
                    style={{
                      marginTop: "6px",
                      marginBottom: 0,
                      fontSize: "13px",
                      textAlign: "center",
                    }}
                  >
                    {category.name}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
      <Slider {...bannerSettings} className="mb-5 rounded-4 shadow"></Slider>
      <Slider {...bannerSettings} className="mb-5 rounded-4 shadow">
        {[Img1, Img2, Img3, Img4].map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt="Banner"
              className="img-fluid w-100 rounded-4"
              style={{
                height: isMobile ? "180px" : "400px",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </Slider>

      <h2 className="text-center fw-bold mb-4" style={{ color: "#7b2ff7" }}>
        Featured Products
      </h2>

      {loading ? (
        <div className="text-center my-5">
          <h3>Loading...</h3>
        </div>
      ) : (
        <div className="main-container">
          {new URLSearchParams(location.search).get("search") && (
            <h1 className="text-center mb-4">Search Results</h1>
          )}
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  refreshProducts={getProducts}
                />
              ))
            ) : (
              <>
                {/* {Swal.fire({
                  icon: "info",
                  title: "No Products",
                  text: "No products found for your search.",
                  width: "350px",
                  confirmButtonColor: "#0d6efd",
                  timer: 1800,
                  showConfirmButton: false,
                })} */}

                <p
                  style={{
                    textAlign: "center",
                    marginTop: "50px",
                    fontSize: "20px",
                    color: "#666",
                  }}
                >
                  No products found.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
