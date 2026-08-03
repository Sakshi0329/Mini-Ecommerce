import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import API, { updateProduct } from "../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    image: "",
    category: "",
    stock: "",
    inStock: true,
    upiId: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);

      setFormData({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        discountPrice: data.discountPrice || "",
        image: data.image || "",
        category: data.category || "",
        stock: data.stock || "",
        inStock: data.inStock,
        upiId: data.upiId || "",
      });

      setLoading(false);
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load product.",
        width: "350px",
      });

      navigate("/admin/product");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProduct(id, formData);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product Updated Successfully",
        width: "350px",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/admin/product");
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Update Failed",
        width: "350px",
      });
    }
  };

  if (loading) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow mx-auto" style={{ maxWidth: "700px" }}>
        <div className="card-header bg-primary text-white">
          <h3>Edit Product</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-center">
              <img
                src={formData.image}
                alt=""
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <input
                type="file"
                className="form-control mt-3"
                accept="image/*"
                onChange={handleImage}
              />
            </div>

            <div className="mb-3">
              <label>Name</label>

              <input
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label>Description</label>

              <textarea
                className="form-control"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Price</label>

                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Discount Price</label>

                <input
                  type="number"
                  className="form-control"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label>Category</label>

              <input
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Stock</label>

                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>UPI ID</label>

                <input
                  className="form-control"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formData.inStock}
                name="inStock"
                onChange={handleChange}
              />

              <label className="form-check-label">In Stock</label>
            </div>

            <button className="btn btn-success me-2">Update Product</button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/product")}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
