import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    profileImage: user?.profileImage || "",
  });

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
        localStorage.removeItem("user");
        setUser(null);

        Swal.fire({
          icon: "success",
          title: "Logged Out",
          width: "350px",
          text: "You have been logged out successfully.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/home");
        });
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profileImage: reader.result, // Base64 preview
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setIsEditing(false);

    Swal.fire({
      icon: "success",
      title: "Profile Updated",
      width: "350px",
      text: "Your profile has been updated successfully.",
      confirmButtonColor: "#0d6efd",
    });
  };
  return (
    <div className="container py-5">
      <div
        className="card shadow mx-auto"
        style={{
          maxWidth: "900px",
          borderRadius: "15px",
        }}
      >
        {/* Header */}
        <div
          className="card-header text-center text-white"
          style={{
            background: "#0d6efd",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
          }}
        >
          <h3 className="mb-0">👤 My Profile</h3>
        </div>

        <div className="card-body p-4">
          <div className="row">
            {/* LEFT SIDE */}
            <div className="col-md-4 text-center border-end">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="rounded-circle shadow border"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto shadow"
                  style={{
                    width: "150px",
                    height: "150px",
                    background: "#0d6efd",
                    color: "#fff",
                    fontSize: "55px",
                    fontWeight: "bold",
                  }}
                >
                  {formData.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <h5 className="mt-3">{formData.name}</h5>
              {/* <p className="text-muted">{formData.email}</p> */}
              <div className="mt-4">
                {!isEditing ? (
                  <>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary flex-fill"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </button>

                      <button
                        className="btn btn-danger flex-fill"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Change Photo */}
                    <div className="text-center mb-3">
                      <label
                        htmlFor="profileImage"
                        className="btn btn-outline-primary"
                        style={{ cursor: "pointer" }}
                      >
                        📷 Change Profile Photo
                      </label>

                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </div>

                    {/* Save + Logout */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success flex-fill"
                        onClick={handleSave}
                      >
                        ✔ Save Changes
                      </button>

                      <button
                        className="btn btn-danger flex-fill"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>

                    {/* Cancel */}
                    <button
                      className="btn btn-secondary w-100 mt-2"
                      onClick={() => {
                        Swal.fire({
                          title: "Discard Changes?",
                          text: "Your unsaved changes will be lost.",
                          icon: "warning",
                          width: "350px",
                          showCancelButton: true,
                          confirmButtonText: "Yes",
                          cancelButtonText: "No",
                          confirmButtonColor: "#dc3545",
                          cancelButtonColor: "#6c757d",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            setFormData({
                              name: user?.name || "",
                              email: user?.email || "",
                              phone: user?.phone || "",
                              address: user?.address || "",
                              profileImage: user?.profileImage || "",
                            });

                            setIsEditing(false);
                          }
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-md-8">
              <div className="row g-2">
                {/* <div className="col-12">
                  <label className="form-label fw-bold">User ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?._id || ""}
                    disabled
                  />
                </div> */}

                <div className="col-md-6">
                  <label className="form-label fw-bold">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.role || "Customer"}
                    disabled
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold">Address</label>
                  <textarea
                    rows="3"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
