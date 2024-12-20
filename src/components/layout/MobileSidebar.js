import React, { useState } from "react";
import styled from "styled-components";
import { mixins } from "../../styles/GlobalStyles.styles";
import MoSidebarList from "./MoSidebarList";
import { AnimatePresence, motion, transform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AddStoryHeader from "./AddStoryHeader";

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 70px;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.fontColor};
  border-radius: 26px 26px 0 0;
  z-index: 100;
  ${mixins.flex({})}
  .iconsWrapper {
    width: 390px;
    padding: 0 10px;
    ${mixins.flex({
      justify: "space-around",
      gap: "0",
    })}
    .icon {
      width: 40px;
      height: 40px;
      ${mixins.flex({})}
      cursor: pointer;
      > span {
        font-size: 40px;
        color: ${({ theme }) => theme.fontColor};
      }
      &.plusIcon {
        width: 70px;
        height: 70px;
        transform: translateY(-20px);
        background: var(--point-color);
        border: 4px solid ${({ theme }) => theme.bgColor};
        border-radius: 50%;
        > span {
        }
      }
    }
  }
`;

const MobileSidebar = () => {
  const [listShow, setListShow] = useState(false);
  const [writeMode, setWriteMode] = useState(false);
  const nevigate = useNavigate();

  const goHome = () => {
    nevigate("/");
  };

  const openList = (e) => {
    e.stopPropagation();
    setListShow((prev) => !prev);
  };

  const circleVarients = {
    initial: {
      scale: 0.2,
      opacity: 0.2,
      y: "30%",
      x: "-50%",
      rotate: -60,
      transition: { duration: 0.5 },
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      x: "-50%",
      rotate: 0,
      transition: { duration: 0.5 },
    },
    leaving: {
      scale: 0.2,
      opacity: 0,
      y: "30%",
      x: "-50%",
      rotate: -60,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <Wrapper $flexProps>
        <div className="iconsWrapper" onClick={goHome}>
          <div className="icon">
            <span className="material-symbols-outlined">home</span>
          </div>
          <div className="icon">
            <span className="material-symbols-outlined">shopping_bag</span>
          </div>
          <div className="icon plusIcon" onClick={openList}>
            <span className="material-symbols-outlined">add</span>
          </div>
          <div className="icon">
            <span className="material-symbols-outlined">
              local_fire_department
            </span>
          </div>
          <div className="icon">
            <span className="material-symbols-outlined">menu</span>
          </div>
        </div>
      </Wrapper>
      <AnimatePresence>
        {listShow && (
          <MoSidebarList
            variants={circleVarients}
            initial="initial"
            animate="visible"
            exit="leaving"
            openList={openList}
            setWriteMode={setWriteMode}
          />
        )}
      </AnimatePresence>
      {writeMode && <AddStoryHeader setWriteMode={setWriteMode} />}
    </>
  );
};

export default MobileSidebar;
