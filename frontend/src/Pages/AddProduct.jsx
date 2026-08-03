import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import API from "../services/api";
import Swal from "sweetalert2";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    inStock: true,
    image: "",
    description: "",
    category: "",
  });
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5242880) {
      Swal.fire({
        icon: "warning",
        title: "Image Too Large",
        text: "Please choose an image smaller than 5 MB.",
        confirmButtonColor: "#198754",
        width: "350px",
      });
      e.target.value = null;
      return;
    }
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProduct({ ...product, image: reader.result });
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.image) {
      return Swal.fire({
        icon: "warning",
        title: "Image Required",
        text: "Please select a product image.",
        confirmButtonColor: "#198754",
        width: "350px",
      });
    }
    try {
      // Price ko hamesha Number mein bhejo, backend string par error deta hai
      const finalProduct = {
        ...product,
        price: Number(product.price),
        discountPrice: Number(product.discountPrice),
        stock: Number(product.stock),
        inStock: product.inStock,
      };

      // ✅ Sirf 'API' call karo, token interceptor apne aap sambhaal lega
      await API.post("/products/add", finalProduct);

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product added successfully.",
        confirmButtonColor: "#198754",
        width: "350px",
      });

      navigate("/");
    } catch (err) {
      console.error("Upload Error:", err.response?.data);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          err.response?.data?.msg ||
          err.response?.data?.error ||
          "Admin authorization failed.",
        confirmButtonColor: "#dc3545",
        width: "350px",
      });
    }
  };

  const categoryList = [
    { name: "All" },
    { name: "Fashion" },
    { name: "Electronics" },
    { name: "Beauty" },
    { name: "Groceries" },
    { name: "Footwear" },
    { name: "Accessories" },
    { name: "Food" },
    { name: "Kitchen" },
  ];

  return (
    <div
      className="container py-5"
      style={{
        maxWidth: "700px",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          borderRadius: "18px",
        }}
      >
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} className="admin-form">
            <h2
              className="text-center fw-bold mb-4"
              style={{
                color: "#198754",
              }}
            >
              Add New Product
            </h2>
            <input
              type="text"
              placeholder="Product Name"
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
            <div
              style={{
                height: "45px",

                display: "flex",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <input
                type="number"
                placeholder="Price (₹)"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
                required
                style={{ flex: 1, height: "45px" }}
              />

              <input
                type="number"
                placeholder="Discount Price (₹)"
                value={product.discountPrice}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    discountPrice: e.target.value,
                  })
                }
                style={{ flex: 1, height: "45px" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <input
                type="number"
                placeholder="Stock Quantity"
                value={product.stock}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    stock: e.target.value,
                  })
                }
                style={{
                  flex: 1,
                  height: "45px",
                }}
              />

              <select
                value={product.inStock}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    inStock: e.target.value === "true",
                  })
                }
                style={{
                  flex: 1,
                  height: "45px",
                  padding: "0 12px",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                }}
              >
                <option value={true}>In Stock</option>
                <option value={false}>Out Of Stock</option>
              </select>
            </div>
            <div
              style={{
                textAlign: "left",
                marginBottom: "10px",
                marginTop: "0px",
              }}
            >
              <label
                style={{ fontSize: "12px", color: "#666", marginLeft: "5px" }}
              >
                Select Photo:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
            {product.image && (
              <img
                src={product.image}
                alt="Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  objectFit: "cover",
                }}
              />
            )}
            <select
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              required
              style={{
                width: "100%",
                height: "45px",
                marginBottom: "15px",
                padding: "0 12px",
                borderRadius: "8px",
                border: "1px solid #ced4da",
              }}
            >
              <option value="">Select Category</option>

              {categoryList.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="description..."
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              required
            ></textarea>
            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-bold"
              style={{
                borderRadius: "10px",
                fontSize: "17px",
              }}
            >
              Upload Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
