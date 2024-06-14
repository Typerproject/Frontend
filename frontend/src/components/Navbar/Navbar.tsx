// import React from 'react'
import { NavLink } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { useAppSelector } from "../../store";
import defaultLogo from "../../assets/default_profile.svg";

export default function Navbar() {
  const userInfo = useAppSelector((state)=>state.user);
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
          <NavLink to="/editor">
            <p className="text-[#E5E5E5] text-xl hover:text-white">Write</p>
          </NavLink>
        </div>
        <div>
          <NavLink to="/my" className="bg-white">
            <img
              className="w-[40px] rounded-full"
              src={userInfo.profile || defaultLogo}
            />
          </NavLink>
        </div>
      </div>
    </nav>
  );
}