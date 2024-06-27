import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { setUser } from "../../store/reducers/user";
import Loading from "./Loading";

const Redirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    if (code) {
      axios
        .post(`${import.meta.env.VITE_BASE_URI}/auth`, {
          code: code,
        })
        .then((response) => {
          const user = response.data;
          dispatch(setUser(user));
          navigate("/");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.error("인가 코드가 URL에 없습니다.");
    }
  }, [location, dispatch, navigate]);

  return (
    <div>
      <Loading />
    </div>
  );
};

export default Redirect;
