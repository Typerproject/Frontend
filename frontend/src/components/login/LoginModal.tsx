import React from "react";
import Modal from "react-modal";
import "./login.css";

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
    <Modal className="modal" isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className="modal-content">
        {/* 닫기 버튼 */}
        <button className="close-button" onClick={onRequestClose} />

        {/* 문구 */}
        <div className="comment">
          <p>편리하고 쉬운 주식블로그!</p>
          <p>Typer를 경험해보세요!</p>
        </div>

        {/* 일직선 */}
        <div className="line"></div>

        {/* 로그인 버튼 */}
        <button onClick={handleLogin} className="login-button" />
      </div>

      {/* 서비스 미리보기 */}
      <div className="preview">
        <a>서비스 미리보기</a>
      </div>
    </Modal>
  );
};

export default LoginModal;
