import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./styles/Theme";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GlobalStyles } from "./styles/GlobalStyles.styles";
import Layout from "./components/layout/Layout";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import DetailPage from "./pages/DetailPage";
import MyProfile from "./pages/MyProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { userKakaoCredentials } from "./routes/KakaoRedirect";
import KakaoRedirect from "./routes/KakaoRedirect";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userAuth } from "./configs/firebase";
import LoadingScreen from "./common/LoadingScreen";

// 라우터 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <MainPage /> },
      { path: "/detail/:id", element: <DetailPage /> },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth/callback/kakaotalk",
    element: <KakaoRedirect />,
  },
]);

export const DarkModeStateContext = React.createContext();

function App() {
  const [user, setUser] = useState({
    userName: "",
    id: "",
    profilePic: "",
    accessToken: "",
    isLoggedIn: false,
    user: "",
  });

  const [darkmode, setDarkmode] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const handleDarkmode = (e) => {
    setDarkmode((currrent) => !currrent);
  };

  const init = async () => {
    await userAuth.authStateReady();
    // getPopularPosts(data);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({ ...user, user, isLoggedIn: !user.isLoggedIn });
      }
      setLoading(false); // 인증 상태가 확인되면 로딩 종료
    });
    return () => unsubscribe(); // 컴포넌트가 언마운트될 때 리스너 해제
  }, []);

  useEffect(() => {
    init();
  }, []);

  // 로딩 중일 때는 로딩 화면을 표시
  if (loading) {
    return <LoadingScreen />; // 원하는 로딩 UI로 대체 가능
  }

  return (
    <>
      <userKakaoCredentials.Provider value={{ user, setUser }}>
        <GlobalStyles /> {/* 전역 스타일 적용 */}
        <DarkModeStateContext.Provider value={{ darkmode, handleDarkmode }}>
          <ThemeProvider theme={darkmode ? darkTheme : lightTheme}>
            <RouterProvider router={router} /> {/* 라우터 제공 */}
          </ThemeProvider>
        </DarkModeStateContext.Provider>
      </userKakaoCredentials.Provider>
    </>
  );
}

export default App;
