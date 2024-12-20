import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { userAuth } from "../configs/firebase";
import { userKakaoCredentials } from "../routes/KakaoRedirect";
import Modal from "./Login/LoginModal/Modal";

const ProtectedRoute = ({ children }) => {
  const loggedUser = userAuth.currentUser;
  const { user } = useContext(userKakaoCredentials);

  if (loggedUser) return children;
  else
    return (
      <>
        <Modal />
      </>
    );
};

export default ProtectedRoute;
