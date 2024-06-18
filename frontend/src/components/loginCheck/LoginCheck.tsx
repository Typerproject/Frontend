import { useEffect } from "react";
import userAPI from "../../api/userAPI";
import { useAppDispatch } from "../../store";
import { logoutUser } from "../../store/reducers/user";

const userService = new userAPI(import.meta.env.VITE_BASE_URI);

export default function LoginCheck() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    userService
      .checkCookie()
      .then((isCookiePresent) => {
        if (!isCookiePresent) {
          dispatch(logoutUser());
          console.log("쿠키 만료에 따른 로컬 스토리지 초기화");
        } else {
          console.log("쿠키 살아 있음");
        }
      })
      .catch((err) => {
        console.error("쿠키 유무 확인 에러: ", err);
      });
  }, []);

  return null;
}
