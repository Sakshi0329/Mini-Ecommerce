import React from 'react';
import { FaRocket, FaHeart, FaUsers, FaShieldAlt } from 'react-icons/fa';

export const About = () => {
  return (
    <div className="container my-5">
      {/* Hero */}
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: "#7b2ff7" }}>
          About <span style={{ color: "#f107a3" }}>Luxora</span>
        </h1>
        <p className="lead text-muted">
          More than just shopping – we’re a lifestyle brand crafted for trendsetters 🚀
        </p>
        <img
          src="https://img.freepik.com/free-vector/ecommerce-web-page-concept-illustration_114360-8201.jpg"
          alt="About Luxora"
          className="img-fluid rounded shadow mt-4"
          style={{ maxHeight: "350px" }}
        />
      </div>

      {/* Journey */}
      <div className="bg-light rounded p-4 shadow mb-5">
        <h3 className="text-center mb-4">🌟 Our Journey</h3>
        <p className="text-center text-muted">
          Luxora started in 2022 with a mission to make shopping smarter, faster, and more exciting. 
          From fashion to electronics, we bring you everything you love – at prices you’ll love even more.
        </p>
        <div className="row text-center mt-4">
          <div className="col-md-4">
            <h4 className="fw-bold text-primary">2022</h4>
            <p className="small text-muted">Founded with just 50 products</p>
          </div>
          <div className="col-md-4">
            <h4 className="fw-bold text-success">2023</h4>
            <p className="small text-muted">Crossed 10,000 happy customers</p>
          </div>
          <div className="col-md-4">
            <h4 className="fw-bold text-danger">2024</h4>
            <p className="small text-muted">Expanded to 100+ categories</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="row text-center my-5">
        <h3 className="mb-4">💡 What We Believe</h3>
        <div className="col-md-3 mb-3">
          <div className="p-4 bg-white shadow rounded h-100">
            <FaRocket className="fs-2 text-primary mb-2" />
            <h6>Innovation</h6>
            <p className="small text-muted">Always ahead in trends</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="p-4 bg-white shadow rounded h-100">
            <FaHeart className="fs-2 text-danger mb-2" />
            <h6>Customer First</h6>
            <p className="small text-muted">We value your happiness</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="p-4 bg-white shadow rounded h-100">
            <FaUsers className="fs-2 text-success mb-2" />
            <h6>Community</h6>
            <p className="small text-muted">Built by people, for people</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="p-4 bg-white shadow rounded h-100">
            <FaShieldAlt className="fs-2 text-warning mb-2" />
            <h6>Trust</h6>
            <p className="small text-muted">Safe & secure shopping</p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="text-center my-5">
        <h3 className="mb-4">👩‍💻 Meet Our Team</h3>
        <div className="row justify-content-center">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow rounded">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" className="card-img-top rounded-top" alt="CEO"/>
              <div className="card-body">
                <h6 className="fw-bold">Sakshi Sharma</h6>
                <p className="small text-muted">Founder & CEO</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow rounded">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" className="card-img-top rounded-top" alt="CTO"/>
              <div className="card-body">
                <h6 className="fw-bold">Rohit Kumar</h6>
                <p className="small text-muted">CTO & Tech Head</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow rounded">
              <img src="https://randomuser.me/api/portraits/women/68.jpg" className="card-img-top rounded-top" alt="Designer"/>
              <div className="card-body">
                <h6 className="fw-bold">Anjali Verma</h6>
                <p className="small text-muted">Creative Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final */}
      <div className="text-center mt-5">
        <p className="lead fw-bold text-primary">
          🚀 Luxora isn’t just an e-commerce store – it’s a movement towards smarter shopping!
        </p>
      </div>
    </div>
  );
};
