import React, { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { userAuth } from "../../../configs/firebase";
import { motion } from "framer-motion";
import styled from "styled-components";
import { GlobalStyles, mixins } from "../../../styles/GlobalStyles.styles";
import KakaoLogin from "./KakaoLogin";
import { userKakaoCredentials } from "../../../routes/KakaoRedirect";
import logo from "../../../images/kakaoLogoLight.png";
import mobileLogo from "../../../images/kakaoLogoMobile.png";
import lightThemeImg from "../../../images/kakaoLoginImgLight.png";
import darkThemeImg from "../../../images/kakaoLoginImgDark.png";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { DarkModeStateContext } from "../../../App";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  position: fixed;
  z-index: 10000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100vh;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  @media screen and (max-width: 768px) {
    background: var(--main-white);
    flex-direction: column;
    .mobile-inner {
      width: 370px;
      margin: 0 auto;
      padding: 0 30px;
      .mobile-contents {
        width: 300px;
        justify-content: center;
        align-items: center;
        .main-logo {
          width: 80px;
          position: static;
          object-fit: cover;
          margin-bottom: 14px;
        }
        .mobile-forms {
          display: flex;
          flex-direction: column;
          width: 100%;
          position: static;
          .welcome-title {
            text-align: center;
          }
          .mobile-divider {
            order: 1;
            & div {
              width: 110px;
            }
          }
          .mobile-input {
            order: 0;
          }
          .mobile-submenu {
            order: 4;
          }
          .mobile-login-btn {
            order: 0;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
  & * {
    input[type="password"]::-ms-reveal,
    input[type="password"]::-ms-clear,
    input[type="password"]::-webkit-textfield-decoration-container {
      display: none;
    }
  }
`;

const LoginModal = styled.div`
  position: relative;
  width: 1000px;
  height: 700px;
  padding: 40px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 110px;
  background: var(--main-white);
`;

const LeftArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 100%;
`;
const RightArea = styled.div`
  height: 100%;
`;

const LogoImg = styled.img`
  width: 206px;
  height: 80px;
  object-fit: cover;
  position: absolute;
  left: 24px;
  top: 12px;
`;

const LeftAreaWrapper = styled.form`
  position: absolute;
  top: 90px;
  width: 400px;
`;

const WelcomeTitle = styled.p`
  font-family: var(--kakao-big-regular);
  font-size: 30px;
  margin-bottom: 44px;
`;

const LoginDivider = styled.div`
  ${mixins.flex({ gap: 10 })};
  margin-bottom: 16px;
`;

const DividerPart = styled.div`
  width: 140px;
  height: 1px;
  background: #ccc;
`;

const DividerText = styled.span`
  font-size: 12px;
  font-family: var(--kakao-big-regular);
  color: #ccc;
`;

const InputBoxes = styled.div`
  ${mixins.flex({ direction: "column", gap: 10 })}
  width: 100%;
  position: relative;
  margin-bottom: 20px;
  &:last-of-type {
    margin-bottom: 26px;
  }
`;

const InputTitles = styled.span`
  align-self: flex-start;
  font-family: var(--kakao-big-regular);
  font-size: 16px;
  color: #aaa;
  span {
    color: crimson;
  }
  &:hover {
    text-decoration: none;
  }
`;

const InputForms = styled(motion.input)`
  ${mixins.loginform()}
  padding-left: 14px;
  &::placeholder {
    font-size: 14px;
    color: #aaa;
  }
  &:focus {
    outline: none;
    ${mixins.border({ color: "var(--point-color)" })}
  }
`;

const VisibleIcon = styled.span`
  position: absolute;
  right: 14px;
  bottom: 14px;
  padding: 4px;
  border-radius: 50%;
  font-size: 20px;
  font-weight: 300;
  line-height: 12px;
  transition: all 0.3s;
  color: #ccc;
  cursor: pointer;
`;

const EmailLoginBtn = styled.input`
  ${mixins.loginform({
    bg: "var(--point-color)",
    fontsize: "18px",
    textalign: "center",
    hover: "opacity: 0.8; box-shadow: 0 0 4px rgba(0, 0, 0, 0.2)",
  })}
  border: none;
  margin-bottom: 40px;
`;

const SubMenuWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

const SubMenus = styled.div`
  font-family: var(--kakao-big-regular);
  .find-id,
  .find-pw {
    &:hover {
      text-decoration: underline;
    }
  }
  &:first-of-type {
    margin-bottom: 10px;
    color: #ccc;
    span {
      margin-right: 4px;
      cursor: pointer;
    }
  }
  &:last-of-type {
    span:last-child {
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;

const Modal = () => {
  const navigate = useNavigate();
  const idRef = useRef();
  const pwRef = useRef();
  const valueIdRef = useRef();
  const valuePwRef = useRef();
  const [isVisible, setIsVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(null);
  const [isResponsive, setIsResponsive] = useState(false);
  const [isError, setIsError] = useState({
    id: false,
    pw: false,
  });
  const [registerMode, setRegisterMode] = useState(false);
  const [welcomeText, setWelcomeText] = useState("돌아오신 것을 환영합니다!");
  const [loginBtnText, setLoginBtnText] = useState("이메일 로그인");

  const { darkmode } = useContext(DarkModeStateContext);
  const { user, setUser } = useContext(userKakaoCredentials);

  const listenResizeEvent = () => {
    if (window.innerWidth < 768) {
      setIsResponsive(true);
    } else {
      setIsResponsive(false);
    }
  };

  useEffect(() => {
    idRef.current.focus();
    listenResizeEvent();
    window.addEventListener("resize", listenResizeEvent);
  }, []);

  useEffect(() => {
    if (registerMode) {
      setLoginBtnText("회원가입");
    } else {
      setLoginBtnText(isResponsive ? "로그인" : "이메일 로그인");
    }
  }, [isResponsive, registerMode]);

  const toggleFocus = (e) => {
    setIsFocused(e.target.name);
  };

  const toggleBlur = (e) => {
    setIsFocused(null);
    setIsError({
      id: false,
      pw: false,
    });
  };

  const toggleVisible = () => {
    setIsVisible((current) => !current);
  };

  const toggleRegisterMode = () => {
    setRegisterMode((current) => !current);
    idRef.current.value = "";
    pwRef.current.value = "";
    if (!registerMode) {
      setWelcomeText("환영합니다!");
      setLoginBtnText("회원가입");
    } else {
      setWelcomeText("돌아오신 것을 환영합니다!");
      if (isResponsive) setLoginBtnText("로그인");
      if (!isResponsive) setLoginBtnText("이메일 로그인");
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     // Kakao 로그아웃 REST API 호출
  //     const accessToken = userAuth.currentUser?.stsTokenManager.accessToken;

  //     // Firebase 로그아웃
  //     await userAuth.signOut();

  //     if (accessToken) {
  //       await axios.post(
  //         "https://kapi.kakao.com/v1/user/logout",
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${user.accessToken}`,
  //           },
  //         }
  //       );
  //       // console.log("Kakao 로그아웃 완료");
  //       setUser({
  //         ...user,
  //         isLoggedIn: false,
  //       });
  //     } else {
  //       // console.log("Access Token이 없습니다.");
  //     }
  //   } catch (error) {
  //     console.log("로그아웃 중 오류 발생:", error);
  //   } finally {
  //     window.alert("로그아웃 되셨습니다.");
  //     navigate("/");
  //   }
  // };

  const handleEmailLogin = async (id, pw) => {
    try {
      const firebaseCredentials = await signInWithEmailAndPassword(
        userAuth,
        id,
        pw
      );

      const firebaseUser = firebaseCredentials.user;

      if (!firebaseUser.emailVerified) {
        alert("이메일 인증이 완료되지 않았습니다. 로그아웃 중..");
        signOut(userAuth);
      } else {
        alert(`${firebaseUser.email.split("@")[0]}님, 환영합니다!`);
        // console.log(userAuth.currentUser);
        setUser({ ...user, isLoggedIn: true });
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        // console.log(e.code);
        if (e.code === "auth/user-not-found")
          window.alert("존재하지 않는 계정입니다. 다시 시도해주세요.");
        else if (e.code === "auth/wrong-password") {
          setIsError({ ...isError, pw: true });
          window.alert("비밀번호가 올바르지 않습니다. ");
        } else if (e.code === "auth/invalid-credential")
          window.alert(
            "아이디 혹은 비밀번호가 올바르지 않습니다. 다시 시도해주세요."
          );
        else if (e.code === "auth/too-many-requests")
          window.alert(
            "잘못된 로그인 시도가 너무 많아 비밀번호를 재설정하시거나 잠시 후 다시 시도해 주세요."
          );
        else window.alert(e.message);
      }
    }
  };

  const handleEmailRegister = async (id, pw) => {
    try {
      const firebaseCredentials = await createUserWithEmailAndPassword(
        userAuth,
        id,
        pw
      );
      const firebaseUser = firebaseCredentials.user;

      if (firebaseUser) {
        await sendEmailVerification(firebaseUser);
        alert(
          "계정이 성공적으로 생성되었습니다. 로그인하기 전에 이메일에서 인증 링크를 확인한 후 다시 로그인해 주십시오."
        );
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        if (e.code === "auth/weak-password")
          window.alert("비밀번호는 6자 이상이어야 합니다.");
        else if (e.code === "auth/email-already-in-use")
          window.alert(
            "이미 사용중인 이메일입니다. 다른 이메일로 다시 시도해주세요."
          );
        else window.alert(e.message);
      }
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    valueIdRef.current = idRef.current.value;
    valuePwRef.current = pwRef.current.value;
    const idValue = valueIdRef.current;
    const pwValue = valuePwRef.current;

    if (valueIdRef.current === "" && valuePwRef.current === "") {
      setIsError({
        id: true,
        pw: true,
      });
      return;
    } else if (valueIdRef.current === "") {
      setIsError({
        ...isError,
        id: true,
      });
      return;
    } else if (valuePwRef.current === "") {
      setIsError({
        ...isError,
        pw: true,
      });
      return;
    } else {
      setIsError({
        id: false,
        pw: false,
      });
      if (!registerMode) {
        handleEmailLogin(idValue, pwValue);
      } else {
        handleEmailRegister(idValue, pwValue);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") onFormSubmit(e);
    else return;
  };

  const handleInvalidEmail = () => {
    setIsError({
      ...isError,
      id: true,
    });
  };

  return (
    <Wrapper style={{ background: darkmode && isResponsive && "#000" }}>
      <LoginModal
        className="mobile-inner"
        style={{ background: darkmode ? "#000" : "fff" }}
      >
        <LeftArea className="mobile-contents">
          <LogoImg
            src={!isResponsive ? logo : mobileLogo}
            alt="mainlogo"
            className="main-logo"
          />
          <LeftAreaWrapper
            className="mobile-forms"
            onSubmit={onFormSubmit}
            onKeyDown={handleKeyPress}
          >
            <WelcomeTitle
              style={{ color: darkmode ? "#fff" : "#000" }}
              className="welcome-title"
            >
              {!isResponsive ? welcomeText : "kakao "}
              {isResponsive && <b>story</b>}
            </WelcomeTitle>
            <KakaoLogin isRegisterMode={registerMode} darkmode={darkmode} />
            <LoginDivider className="mobile-divider">
              <DividerPart></DividerPart>
              <DividerText>
                {!isResponsive
                  ? !registerMode
                    ? "이메일로 로그인하기"
                    : "이메일로 회원가입"
                  : "간편 로그인"}
              </DividerText>
              <DividerPart></DividerPart>
            </LoginDivider>
            <InputBoxes className="mobile-input">
              <InputTitles
                className="input-title"
                style={{
                  color:
                    isFocused === "id" && darkmode
                      ? "#fff"
                      : isFocused !== "id"
                      ? ""
                      : "#000",
                }}
              >
                이메일 입력<span>*</span>
              </InputTitles>
              <InputForms
                ref={idRef}
                type="email"
                placeholder="이메일"
                onFocus={toggleFocus}
                onBlur={toggleBlur}
                onInvalid={handleInvalidEmail}
                name="id"
                style={{
                  border: isError.id ? "1px solid red" : "",
                  color: darkmode ? "#fff" : "",
                }}
                initial={{ x: 0 }}
                animate={
                  isError.id
                    ? { x: [0, 50, -50, 50, -50, 50, -50, 50, -50, 50, -50, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.6 }}
              ></InputForms>
            </InputBoxes>
            <InputBoxes className="mobile-input">
              <InputTitles
                className="input-title"
                style={{
                  color:
                    isFocused === "password" && darkmode
                      ? "#fff"
                      : isFocused !== "password"
                      ? ""
                      : "#000",
                }}
              >
                비밀번호 입력 <span>*</span>
              </InputTitles>
              <InputForms
                type={!isVisible ? "text" : "password"}
                placeholder="비밀번호"
                onFocus={toggleFocus}
                onBlur={toggleBlur}
                name="password"
                ref={pwRef}
                style={{
                  border: isError.pw ? "1px solid red" : "",
                  color: darkmode ? "#fff" : "",
                }}
                initial={{ x: 0 }}
                animate={
                  isError.pw
                    ? { x: [0, 50, -50, 50, -50, 50, -50, 50, -50, 50, -50, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.6 }}
              ></InputForms>
              <VisibleIcon
                className="material-symbols-outlined"
                onClick={toggleVisible}
              >
                {isVisible ? "visibility" : "visibility_off"}
              </VisibleIcon>
            </InputBoxes>
            <EmailLoginBtn
              type="submit"
              value={loginBtnText}
              className="mobile-login-btn"
            ></EmailLoginBtn>
            <SubMenuWrapper className="mobile-submenu">
              <SubMenus style={{ color: darkmode ? "#888" : "" }}>
                <span className="find-id">아이디 찾기</span>
                <span>|</span>
                <span className="find-pw">비밀번호 찾기</span>
              </SubMenus>
              <SubMenus style={{ color: darkmode ? "#ccc" : "" }}>
                <span>
                  {!registerMode
                    ? "계정이 없으시다면?"
                    : "계정이 이미 있으시다면?"}{" "}
                </span>
                <span onClick={toggleRegisterMode}>
                  {!registerMode ? "회원가입" : "로그인하기"}
                </span>
              </SubMenus>
            </SubMenuWrapper>
          </LeftAreaWrapper>
        </LeftArea>
        {!isResponsive && (
          <RightArea className="right-area">
            <img
              src={darkmode ? darkThemeImg : lightThemeImg}
              alt="lightThemeImg"
            />
          </RightArea>
        )}
      </LoginModal>
    </Wrapper>
  );
};

export default Modal;
