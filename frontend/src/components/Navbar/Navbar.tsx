// import React from 'react'
import { NavLink } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { useAppSelector, useAppDispatch } from "../../store";
// import defaultLogo from "../../assets/default_profile.svg";
import { BsPersonCircle } from "react-icons/bs";
import { useState } from "react";
import { logoutUser } from "../../store/reducers/user";
import userAPI from "../../api/userAPI";
import LoginModal from "../login/LoginModal";

const service = new userAPI(import.meta.env.VITE_BASE_URI);

export default function Navbar() {
  const userInfo = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    service.logout().then((data) => {
      console.log(data);
      setMenuOpen(false);
      dispatch(logoutUser());
    });
  };

  console.log(userInfo);
  return (
    <nav className="bg-black fixed w-full h-fit py-[0.75em] px-[1.5rem] top-0 flex justify-between z-[100]">
      <div className="flex gap-[2rem] items-center">
        <NavLink to="/">
          <p className="text-white text-[20px]">
            <span className="text-[35px]">T</span>yper
          </p>
        </NavLink>
        <div className="relative hidden md:inline-block">
          <IoMdSearch className="absolute top-[25%] left-[10px]" />
          <input className="h-[30px] rounded-full pl-[30px] pr-[10px] py-[5px] bg-[#E5E5E5]" />
        </div>
      </div>
      <div className="flex gap-[1rem] items-center">
        <div>
          {userInfo._id ? (
            <NavLink to="/editor">
              <p className="text-[#E5E5E5] text-xl hover:text-white cursor-pointer">
                Write
              </p>
            </NavLink>
          ) : (
            <p
              onClick={handleLoginClick}
              className="text-[#E5E5E5] text-xl hover:text-white cursor-pointer"
            >
              Login
            </p>
          )}
        </div>
        <div>
          {userInfo.profile ? (
            <img
              onClick={handleToggleMenu}
              className="w-[40px] rounded-full cursor-pointer transition duration-200 ease-in-out transform hover:opacity-80"
              src={userInfo.profile}
            />
          ) : (
            <BsPersonCircle size={40} color="gray" />
          )}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <NavLink
                    to={`/my/${userInfo._id}`}
                    className="text-black no-underline cursor-pointer"
                  >
                    My page
                  </NavLink>
                </li>
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onRequestClose={handleLoginClose} />
    </nav>
  );
}
