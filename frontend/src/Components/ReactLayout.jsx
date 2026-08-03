import React from "react";
import { CustomNavbar } from "./Navbar"; // ✅ Corrected name
import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";

// ✅ MAIN LAYOUT
export const ReactLayout = ({ user, setUser }) => {
  return (
    <>
      <CustomNavbar user={user} setUser={setUser} />
      <main className="p-3 min-vh-100 bg-light">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
