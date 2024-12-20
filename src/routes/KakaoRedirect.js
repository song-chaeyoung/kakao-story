import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  REST_API_KEY,
  REDIRECT_URI,
  CLIENT_SECRET,
} from "../configs/kakaologin";
import {
  browserSessionPersistence,
  OAuthProvider,
  setPersistence,
  signInWithCredential,
} from "firebase/auth";
import { userAuth } from "../configs/firebase";

export const userKakaoCredentials = React.createContext();

const KakaoRedirect = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  const navigate = useNavigate();
  const { setUser } = useContext(userKakaoCredentials);

  const getKakaoUserInfo = async (accessToken) => {
    try {
      const userInfoResponse = await axios.get(
        "https://kapi.kakao.com/v2/user/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(userInfoResponse.data);

      const userName = userInfoResponse.data.kakao_account.profile.nickname;
      const kakaoProfilePic =
        userInfoResponse.data.kakao_account.profile.profile_image_url;
      const kakaoId = userInfoResponse.data.id;

      setUser({
        userName,
        kakaoId,
        kakaoProfilePic,
        accessToken,
        isLoggedIn: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getKakaoAuthToken = async () => {
    let payload;
    if (code) {
      payload = {
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code,
        client_secret: CLIENT_SECRET,
      };
    } else {
      alert("계정이 존재하지 않습니다. 다시 시도해주세요.");
    }

    try {
      const request = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        payload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

      const accessToken = request.data.access_token;

      getKakaoUserInfo(accessToken);

      const provider = new OAuthProvider("oidc.kakaostory");
      const credential = provider.credential({
        idToken: request.data.id_token,
      });

      setPersistence(userAuth, browserSessionPersistence).then(() => {
        signInWithCredential(userAuth, credential)
          .then((result) => {
            const credential = OAuthProvider.credentialFromResult(result);
            const acToken = credential?.accessToken;
            const idToken = credential?.idToken;
          })
          .catch((error) => {
            console.log(error);
          });
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getKakaoAuthToken();
  }, [code]);

  return <div>카카오 로그인 진행중..</div>;
};

export default KakaoRedirect;
