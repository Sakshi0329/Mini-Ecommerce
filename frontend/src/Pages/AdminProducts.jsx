import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { fetchProducts, deleteProduct, updateProduct } from "../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 10;

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;

  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await fetchProducts("", true);

      setProducts(data || []);
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load products.",
        width: "350px",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone.",
      icon: "warning",
      width: "350px",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(id);

          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Product deleted successfully.",
            width: "350px",
            timer: 1500,
            showConfirmButton: false,
          });

          getProducts();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete product.",
            width: "350px",
          });
        }
      }
    });
  };

  const handleStockChange = async (id, inStock) => {
    try {
      await updateProduct(id, { inStock });

      setProducts((prev) =>
        prev.map((product) =>
          product._id === id ? { ...product, inStock } : product,
        ),
      );

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Stock updated successfully.",
        timer: 1200,
        showConfirmButton: false,
        width: "350px",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update stock.",
        width: "350px",
      });
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Products</h2>

        {/* <Link to="/admin/add-product" className="btn btn-success">
          + Add Product
        </Link> */}
      </div>

      {loading ? (
        <h4 className="text-center">Loading...</h4>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th width="170">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      width="70"
                      height="70"
                      style={{ objectFit: "cover", borderRadius: "8px" }}
                    />
                  </td>

                  <td>{product.name}</td>

                  <td>{product.category}</td>

                  <td>₹{product.price}</td>

                  <td>₹{product.discountPrice || "-"}</td>

                  <td style={{ width: "170px" }}>
                    <select
                      className={`form-select form-select-sm ${
                        product.inStock ? "border-success" : "border-danger"
                      }`}
                      value={product.inStock ? "true" : "false"}
                      onChange={(e) =>
                        handleStockChange(
                          product._id,
                          e.target.value === "true",
                        )
                      }
                    >
                      <option value="true">🟢 In Stock</option>
                      <option value="false">🔴 Out of Stock</option>
                    </select>
                  </td>

                  <td className="text-center">
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        variant="light"
                        size="sm"
                        className="three-dot-toggle border-0 shadow-none p-1"
                      >
                        <BsThreeDotsVertical size={20} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          as={Link}
                          to={`/admin/edit-product/${product._id}`}
                        >
                          🖉 Update
                        </Dropdown.Item>

                        <Dropdown.Item
                          className="text-danger"
                          onClick={() => handleDelete(product._id)}
                        >
                          🗑 Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
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
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
