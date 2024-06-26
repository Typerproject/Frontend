// import React from 'react'
import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

// type Props = {}

export default function Layout() {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <ScrollRestoration />
    </div>
  );
}
