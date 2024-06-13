import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { setUser } from "../../store/reducers/user";

const Redirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    if (code) {
      axios
        .post(`${import.meta.env.VITE_BASE_URI}auth`, {
          code: code,
        })
        .then((response) => {
          const user = response.data;
          console.log("유저어", user);

          dispatch(setUser(user));

          navigate("/");
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      console.error("인가 코드가 URL에 없습니다.");
    }
  }, [location]);

  return <div>로그인 중!</div>;
};

export default Redirect;
