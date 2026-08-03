import React, { useState } from "react";
import {
  Container,
  Navbar,
  Nav,
  Button,
  Dropdown,
  Offcanvas,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaHeart, FaShoppingCart, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";

export const CustomNavbar = ({ user, setUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  // console.log("Navbar Role:", role);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      width: "350px",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        setUser(null);

        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been logged out successfully.",
          width: "350px",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/");
          window.location.reload();
        });
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Navbar
      bg="white"
      expand="lg"
      sticky="top"
      className="shadow-sm border-bottom py-3"
    >
      <Container>
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            background: "linear-gradient(90deg, #f107a3, #7b2ff7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block",
          }}
          className="fw-bold fs-4"
        >
          🛍️ Luxora
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <div className="d-flex align-items-center gap-2 order-lg-2">
          {/* Mobile Icons */}
          <div className="d-flex d-lg-none align-items-center gap-2">
            {!user ? (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Account</Tooltip>}
              >
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="outline-dark"
                    className="rounded-circle"
                  >
                    <FaUserCircle />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/login">
                      Login
                    </Dropdown.Item>

                    <Dropdown.Item as={Link} to="/register">
                      Sign Up
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </OverlayTrigger>
            ) : (
              <>
                {token && role === "admin" && (
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Add Product</Tooltip>}
                  >
                    <Button
                      as={Link}
                      to="/admin"
                      variant="outline-success"
                      // size="sm"
                      className="rounded-circle"
                    >
                      <FaPlus className="me-1" />
                    </Button>
                  </OverlayTrigger>
                )}

                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="outline-dark"
                    className="rounded-circle"
                  >
                    <FaUserCircle />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      My Profile
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item
                      onClick={handleLogout}
                      className="text-danger"
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}

            {/* Wishlist */}
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Wishlist</Tooltip>}
            >
              <Button
                as={Link}
                to="/wishlist"
                variant="outline-danger"
                className="rounded-circle"
              >
                <FaHeart />
              </Button>
            </OverlayTrigger>

            {/* Cart */}
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Cart</Tooltip>}
            >
              <Button
                as={Link}
                to="/cart"
                variant="outline-primary"
                className="rounded-circle"
              >
                <FaShoppingCart />
              </Button>
            </OverlayTrigger>
          </div>

          {/* Menu Icon */}
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
        </div>

        {/* Offcanvas */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          style={{ width: "200px" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="fw-bold">Luxora</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            {/* Mobile Navigation */}
            <div className="d-flex d-lg-none flex-column gap-4 mt-3">
              <Link
                to="/"
                style={{
                  color: "#000",
                  textDecoration: "none",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Home
              </Link>
              {token && role !== "admin" && (
                <Link
                  to="/product"
                  style={{
                    color: "#000",
                    textDecoration: "none",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  Products
                </Link>
              )}

              {token && role === "admin" && (
                <Link
                  to="/admin/product"
                  style={{
                    color: "#000",
                    textDecoration: "none",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  Products{" "}
                </Link>
              )}
              {/* <Link
                to="/product"
                style={{
                  color: "#000",
                  textDecoration: "none",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Products
              </Link> */}

              {/* Customer Orders */}
              {token && role !== "admin" && (
                <Link
                  to="/my-orders"
                  style={{
                    color: "#000",
                    textDecoration: "none",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  My Orders
                </Link>
              )}

              {/* Admin Orders */}
              {token && role === "admin" && (
                <Link
                  to="/admin/orders"
                  style={{
                    color: "#000",
                    textDecoration: "none",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  Orders
                </Link>
              )}

              <Link
                to="/about"
                style={{
                  color: "#000",
                  textDecoration: "none",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                About
              </Link>
              {/* Customer Contact */}
              {token && role !== "admin" && (
                <Link
                  to="/contact"
                  style={{
                    color: "#000",
                    textDecoration: "none",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  Contact
                </Link>
              )}

              {/* Admin Orders */}
              {token && role === "admin" && (
                <Link
                  to="/admin/contacts"
                  style={{
                    color: "#000",
                    textDecoration: "none",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  Contact
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <Nav className="mx-auto gap-4 d-none d-lg-flex">
              <Nav.Link as={Link} to="/" className="fw-semibold">
                Home
              </Nav.Link>

              {token && role !== "admin" && (
                <Nav.Link as={Link} to="/product" className="fw-semibold">
                  Products
                </Nav.Link>
              )}

              {/* Admin Orders */}
              {token && role === "admin" && (
                <Nav.Link as={Link} to="/admin/product" className="fw-semibold">
                  Products
                </Nav.Link>
              )}
              {/* 
              <Nav.Link as={Link} to="/product" className="fw-semibold">
                Products
              </Nav.Link> */}

              {/* Customer Orders */}
              {token && role !== "admin" && (
                <Nav.Link as={Link} to="/my-orders" className="fw-semibold">
                  My Orders
                </Nav.Link>
              )}

              {/* Admin Orders */}
              {token && role === "admin" && (
                <Nav.Link as={Link} to="/admin/orders" className="fw-semibold">
                  Orders
                </Nav.Link>
              )}

              <Nav.Link as={Link} to="/about" className="fw-semibold">
                About
              </Nav.Link>
              {/* Customer contact */}
              {token && role !== "admin" && (
                <Nav.Link as={Link} to="/contact" className="fw-semibold">
                  Contact
                </Nav.Link>
              )}

              {/* Admin contact */}
              {token && role === "admin" && (
                <Nav.Link
                  as={Link}
                  to="/admin/contacts"
                  className="fw-semibold"
                >
                  Contact
                </Nav.Link>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        {/* Right Side */}
        <div className="d-none d-lg-flex align-items-center gap-2 ms-auto">
          {!user ? (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Account</Tooltip>}
            >
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-dark"
                  className="rounded-circle"
                >
                  <FaUserCircle />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/login">
                    Login
                  </Dropdown.Item>

                  <Dropdown.Item as={Link} to="/register">
                    Sign Up
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </OverlayTrigger>
          ) : (
            <>
              {" "}
              {token && role === "admin" && (
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Add Product</Tooltip>}
                >
                  <Button
                    as={Link}
                    to="/admin"
                    variant="outline-success"
                    // size="sm"
                    className="rounded-circle"
                  >
                    <FaPlus />
                  </Button>
                </OverlayTrigger>
              )}
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-dark"
                  className="rounded-pill px-3"
                >
                  <FaUserCircle className="me-2" />
                  {/* {user.name} */}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>👋 {user.name}</Dropdown.Header>

                  <Dropdown.Item as={Link} to="/profile">
                    My Profile
                  </Dropdown.Item>

                  <Dropdown.Divider />

                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}

          {/* Wishlist */}
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Wishlist</Tooltip>}
          >
            <Button
              as={Link}
              to="/wishlist"
              variant="outline-danger"
              className="rounded-circle"
            >
              <FaHeart />
            </Button>
          </OverlayTrigger>

          {/* Cart */}
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Cart</Tooltip>}>
            <Button
              as={Link}
              to="/cart"
              variant="outline-primary"
              className="rounded-circle"
            >
              <FaShoppingCart />
            </Button>
          </OverlayTrigger>
        </div>
      </Container>
    </Navbar>
  );
};
