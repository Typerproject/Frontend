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
        }
      })
      .catch((err) => {
        console.error("쿠키 유무 확인 에러: ", err);
      });
  }, [dispatch]);

  return null;
}
