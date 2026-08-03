import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchProducts } from "../services/api";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      const isAdmin = user?.isAdmin === true;

      const { data } = await fetchProducts("", isAdmin);

      setProducts(data || []);
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Unable to load products.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    if (!loading && products.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Products",
        text: "No products are available.",
        width: "350px",
        confirmButtonColor: "#0d6efd",
      });
    }
  }, [loading, products]);

  return (
    <div className="container py-4">
      <h2 className="text-center fw-bold mb-4">All Products</h2>

      {loading ? (
        <h3 className="text-center">Loading...</h3>
      ) : (
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
            <p className="text-center text-muted fs-5">
              No products available.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
