import React from "react";
import Modal from "react-modal";
import { GrFormClose } from "react-icons/gr";
import kakaoButton from "../../assets/loginButton.png";

Modal.setAppElement("#root");

interface LoginModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onRequestClose }) => {
  const restApiKey = import.meta.env.VITE_REST_API_KEY;
  const redirect_uri = import.meta.env.VITE_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${restApiKey}&redirect_uri=${redirect_uri}`;

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Modal
      className="flex flex-col justify-between items-center text-center mx-auto my-40 w-[380px] h-[500px] relative mb-0 bg-white rounded-[22px] shadow-2xl"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldFocusAfterRender={false}
      style={
        { overlay:{
          zIndex:1000
        }}
      }

    >
      {/* 닫기 버튼 */}
      <button
        className="w-10 h-10 bg-no-repeat bg-center bg-cover bg-opacity-50 cursor-pointer border-none top-0 left-0 z-50 mt-0 mr-80"
        onClick={onRequestClose}
      >
        <GrFormClose className="w-8 h-8 text-gray-400 mt-3 ml-1" />
      </button>

      <div className="flex flex-col justify-center items-center pt-14">
        {/* 문구 */}
        <div className="flex flex-col justify-center items-center mb-10">
          <p className="text-white text-[20px] bg-black w-20 h-20 flex justify-center items-center rounded-lg shadow-xl pr-0.5">
            <span className="text-[35px]">T</span>
            yper
          </p>
          <p className="mt-10 text-base font-abeezee font-semibold">
            편리하고 쉬운 주식 블로그!
          </p>
          <p className="mt-2 text-base font-abeezee font-semibold">
            Typer를 경험해 보세요!
          </p>
        </div>
      </div>

      {/* 일직선 */}
      <div className="w-76 h-px bg-gray-300"></div>

      {/* 로그인 버튼 */}
      <button
        onClick={handleLogin}
        className="bg-no-repeat bg-center border-none bg-cover cursor-pointer mb-10"
        style={{
          backgroundImage: `url(${kakaoButton})`,
          width: "320px",
          height: "58px",
        }}
      />

      {/* 서비스 미리보기 */}
      <div className="w-[120px] h-[19px] pb-10">
        <button
          className="text-black text-sm underline cursor-pointer"
          style={{ textUnderlineOffset: "5px" }}
        >
          서비스 미리보기
        </button>
      </div>
    </Modal>
  );
};

export default LoginModal;
