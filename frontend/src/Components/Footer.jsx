import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaInfoCircle,
  FaPhoneAlt,
  FaBoxOpen,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer
      style={{ background: "linear-gradient(90deg, #f107a3, #7b2ff7)" }}
      className="text-white pt-5 pb-3 mt-5"
    >
      <Container>
        <Row className="gy-4">
          {/* Company */}
          <Col xs={12} sm={6} lg={3}>
            <h5 className="fw-bold mb-3">🛍️ Luxora</h5>
            <p className="small mb-0">
              Discover trending fashion, gadgets & lifestyle at unbeatable
              prices.
            </p>
          </Col>

          {/* Quick Links */}
          <Col xs={12} sm={6} lg={3}>
            <h6 className="fw-bold mb-3">Quick Links</h6>

            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-decoration-none text-light">
                  <FaInfoCircle className="me-2 text-white" />
                  About Us
                </Link>
              </li>

              <li className="mb-2">
                <Link to="/contact" className="text-decoration-none text-light">
                  <FaPhoneAlt className="me-2 text-white" />
                  Contact
                </Link>
              </li>

              <li>
                <Link to="/product" className="text-decoration-none text-light">
                  <FaBoxOpen className="me-2 text-white" />
                  Products
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contact */}
          <Col xs={12} sm={6} lg={3}>
            <h6 className="fw-bold mb-3">Contact Us</h6>

            <div className="small">
              <p className="mb-2">
                <FaEnvelope className="me-2 text-white" />
                <a
                  href="mailto:support@luxora.com"
                  className="text-decoration-none text-light"
                >
                  support@luxora.com
                </a>
              </p>

              <p className="mb-2">
                <FaMapMarkerAlt className="me-2 text-white" />
                Mumbai, Maharashtra, India
              </p>

              <p className="mb-0">
                <FaPhoneAlt className="me-2 text-white" />
                +91 92568 35731
              </p>
            </div>
          </Col>

          {/* Social */}
          <Col xs={12} sm={6} lg={3}>
            <h6 className="fw-bold mb-3">Follow Us</h6>

            <div className="d-flex gap-3 fs-4 justify-content-sm-start justify-content-center">
              <a href="#" className="text-white">
                <FaFacebookF />
              </a>

              <a href="#" className="text-white">
                <FaInstagram />
              </a>

              <a href="#" className="text-white">
                <FaTwitter />
              </a>

              <a href="#" className="text-white">
                <FaYoutube />
              </a>
            </div>
          </Col>
        </Row>

        <hr className="border-light my-4" />

        <p className="text-center small mb-0">
          © 2025 <strong>Luxora</strong>. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};
