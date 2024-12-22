import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { mixins } from "../../styles/GlobalStyles.styles";
import { useMatch, useNavigate } from "react-router-dom";
import { DarkModeStateContext } from "../../App";
import { userKakaoCredentials } from "../../routes/KakaoRedirect";

const Wrapper = styled.div`
  width: ${({ $showText }) => ($showText ? "360px" : "80px")};
  height: calc(100vh - 60px);
  position: fixed;
  bottom: 0;
  left: 0;
  font-family: var(--pretendard);
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.fontColor};
  ${mixins.flex({
    direction: "column",
    justify: "space-between",
    align: "start",
  })};
  margin: 0 auto;
  padding: 30px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  > div {
    .mainList {
      list-style: none;
      ${mixins.flex({
        direction: "column",
        justify: "center",
        align: "center",
        gap: "30",
      })};
      > li {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px;
        min-width: 40px;
        border-radius: 8px 8px 0 8px;
        transition: all 0s;
        cursor: pointer;
        > span {
          width: 30px;
          height: 30px;
          opacity: ${({ theme }) => theme.modeOpacity};
          > span {
            font-size: 30px;
          }
        }
        > p {
          font-size: 18px;
          opacity: ${({ $textOpacity }) =>
            $textOpacity ? ({ theme }) => theme.modeOpacity : 0};
          white-space: nowrap;
        }
        &.active {
          background: ${({ theme }) => theme.bgSubColor};
          box-shadow: ${({ $showText }) =>
            $showText ? "0 0 20px rgba(0, 0, 0, 0.1)" : ""};
          > span {
            opacity: 1;
          }
        }
        .overText {
          position: absolute;
          top: 50%;
          left: 125%;
          transform: translateY(-50%);
          background: ${({ theme }) => theme.bgSubColor};
          border-radius: 8px 8px 8px 0;
          padding: 6px 16px;
          opacity: 0;
          transition: all 0.3s;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          p {
            font-size: 12px;
            white-space: nowrap;
          }
        }
        &:hover {
          div {
            opacity: 1;
          }
        }
      }
    }
  }
`;

const NavTop = styled.div`
  width: 100%;
`;

const NavBtm = styled.div`
  width: 100%;
`;

const PostListWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: ${({ $showText }) => ($showText ? "-50px" : "-230px")};
  background: ${({ theme }) => theme.bgColor};
  width: 230px;
  padding: 20px;
  border-radius: 0 14px 14px 14px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  z-index: 10;
  .postName {
    font-size: 14px;
    text-align: center;
    margin-bottom: 20px;
  }
  > .postListContainer {
    padding: 10px;
    ${mixins.flex({
      direction: "column",
      align: "start",
      gap: "10",
    })};
    > li {
      position: relative;
      ${mixins.flex({
        justify: "space-between",
        align: "center",
        gap: "6",
      })};
      div {
        width: 20px;
        height: 20px;
        ${mixins.flex({
          gap: "0",
        })};
        span {
          font-size: 18px;
        }
        i {
          font-size: 14px;
        }
        p {
          font-size: 12px;
        }
      }
    }
  }
`;

const Sidebar = () => {
  const [showText, setShowText] = useState(false);
  const [textOpacity, setTextOpacity] = useState(false);
  const [showList, setShowList] = useState(false);

  const { darkmode, handleDarkmode } = useContext(DarkModeStateContext);
  const { user } = useContext(userKakaoCredentials);

  const navigate = useNavigate();
  const homeMatch = useMatch("/");
  const profileMatch = useMatch("/profile");
  const shotMatch = useMatch("/shorts");

  const toggleText = () => {
    if (showText) {
      setShowText(false);
      setTextOpacity(false);
    } else setShowText(true);
  };

  useEffect(() => {
    if (showText) {
      setTimeout(() => {
        setTextOpacity(true);
      }, 100);
    }
  }, [showText]);

  const makePostList = (e) => {
    setShowList((prev) => !prev);
  };

  return (
    <Wrapper $showText={showText} $textOpacity={textOpacity} $flexProps>
      <NavTop>
        <ul className="mainList">
          <li
            className={homeMatch ? "active" : ""}
            onClick={() => navigate("/")}
          >
            <span>
              <span className="material-symbols-outlined">home</span>
            </span>
            <p>홈</p>
            {showText ? null : (
              <div className="overText">
                <p>홈</p>
              </div>
            )}
          </li>
          <li
            className={shotMatch ? "active" : ""}
            onClick={() => navigate("/shorts")}
          >
            <span>
              <span className="material-symbols-outlined">
                local_fire_department
              </span>
            </span>
            {showText && <p>숏폼</p>}
            {showText ? null : (
              <div className="overText">
                <p>숏폼</p>
              </div>
            )}
          </li>
          <li>
            <span>
              <span className="material-symbols-outlined">group</span>
            </span>
            {showText && <p>친구</p>}
            {showText ? null : (
              <div className="overText">
                <p>친구</p>
              </div>
            )}
          </li>
          <li>
            <span>
              <span className="material-symbols-outlined">shopping_bag</span>
            </span>
            {showText && <p>그립</p>}
            {showText ? null : (
              <div className="overText">
                <p>그립</p>
              </div>
            )}
          </li>
          <li onClick={makePostList}>
            <span>
              <span className="material-symbols-outlined">add_box</span>
            </span>
            {showText && <p>만들기</p>}
            {showText ? null : (
              <div className="overText">
                <p>만들기</p>
              </div>
            )}
            {showList && (
              <PostListWrapper $flexProps $showText={showText}>
                {!showText && <p className="postName">만들기</p>}
                <ul className="postListContainer">
                  <li>
                    <div>
                      <span className="material-symbols-outlined">
                        music_note
                      </span>
                    </div>
                    <p>뮤직</p>
                  </li>
                  <li>
                    <div>
                      <span className="material-symbols-outlined">
                        videocam
                      </span>
                    </div>
                    <p>릴스</p>
                  </li>
                  <li>
                    <div>
                      <i className="fa-regular fa-pen-to-square"></i>
                    </div>
                    <p>게시물 올리기</p>
                  </li>
                  <li>
                    <div>
                      <span className="material-symbols-outlined">
                        add_circle
                      </span>
                    </div>
                    <p>스토리 올리기</p>
                  </li>
                  <li>
                    <div>
                      <span className="material-symbols-outlined">star</span>
                    </div>
                    <p>하이라이트</p>
                  </li>
                  <li>
                    <div>
                      <span className="material-symbols-outlined">
                        how_to_vote
                      </span>
                    </div>
                    <p>투표 올리기</p>
                  </li>
                  <li>
                    <div>
                      <span className="material-symbols-outlined">
                        calendar_today
                      </span>
                    </div>
                    <p>일정 업데이트</p>
                  </li>
                </ul>
              </PostListWrapper>
            )}
          </li>
          <li onClick={toggleText}>
            <span>
              {showText ? (
                <span className="material-symbols-outlined">
                  keyboard_double_arrow_left
                </span>
              ) : (
                <span className="material-symbols-outlined">
                  keyboard_double_arrow_right
                </span>
              )}
            </span>
            {showText && <p>접기</p>}
            {showText ? null : (
              <div className="overText">
                <p>접기</p>
              </div>
            )}
          </li>
        </ul>
      </NavTop>

      <NavBtm>
        <ul className="mainList">
          <li>
            <span>
              <span className="material-symbols-outlined">settings</span>
            </span>
            {showText && <p>설정</p>}
            {showText ? null : (
              <div className="overText">
                <p>설정</p>
              </div>
            )}
          </li>
          <li
            onClick={() => navigate("/profile")}
            className={profileMatch ? "active" : ""}
          >
            <span>
              <span className="material-symbols-outlined">account_circle</span>
            </span>
            {showText && <p>프로필</p>}
            {showText ? null : (
              <div className="overText">
                <p>프로필</p>
              </div>
            )}
          </li>
          <li onClick={handleDarkmode}>
            <span>
              {darkmode ? (
                <span className="material-symbols-outlined">light_mode</span>
              ) : (
                <span className="material-symbols-outlined">dark_mode</span>
              )}
            </span>
            {showText && <p>{darkmode ? "라이트모드" : "다크모드"}</p>}
            {showText ? null : (
              <div className="overText">
                <p> {darkmode ? "라이트모드" : "다크모드"}</p>
              </div>
            )}
          </li>
        </ul>
      </NavBtm>
    </Wrapper>
  );
};

export default Sidebar;
