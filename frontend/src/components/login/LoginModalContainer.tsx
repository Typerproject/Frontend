import { useAppDispatch, useAppSelector, RootState } from "../../store";
import { closeLoginModal } from "../../store/reducers/auth";
import LoginModal from "../../components/login/LoginModal";

const LoginModalContainer: React.FC = () => {
  const isLoginModalOpen = useAppSelector(
    (state: RootState) => state.loginModal.isLoginModalOpen
  );
  const dispatch = useAppDispatch();

  return (
    <LoginModal
      isOpen={isLoginModalOpen}
      onRequestClose={() => dispatch(closeLoginModal())}
    />
  );
};

export default LoginModalContainer;
