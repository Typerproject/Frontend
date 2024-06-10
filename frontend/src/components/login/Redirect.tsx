import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Redirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    if (code) {
      axios
        .post("http://localhost:3000/auth", {
          code: code,
        })
        .then((response) => {
          const user = response.data;
          console.log(user);

          const userNickname = user.nickname;
          console.log(userNickname);

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
