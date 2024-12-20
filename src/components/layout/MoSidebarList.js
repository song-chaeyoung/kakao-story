import { motion } from "framer-motion";
import React, { useState, useContext, useRef, useCallback } from "react";
import styled from "styled-components";
import { DarkModeStateContext } from "../../App";
import { mixins } from "../../styles/GlobalStyles.styles";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 150;
  cursor: pointer;
`;

const ContentWrapper = styled(motion.div)`
  width: 360px;
  height: 360px;
  background: ${({ theme }) => theme.bgColor};
  /* background: radial-gradient(circle, #ffffff 60%, transparent 61%); */
  color: ${({ theme }) => theme.fontColor};
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  /* border: 3px solid rgba(240, 240, 240, 0.5); */
  border: ${({ darkmode }) =>
    darkmode
      ? "3px solid rgba(60, 60, 60, 0.5)"
      : "3px solid rgba(240, 240, 240, 0.5)"};
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  overflow: hidden;
`;

const ContentCenter = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(350deg);
  border: 1px solid rgba(70, 70, 70, 0.2);
  border-top-width: 5px;
  border-bottom-width: 0;
  /* box-shadow: inset 4px 10px 10px rgba(0, 0, 0, 0.1),
    inset 0 5px 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 233, 0, 0.5); */
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: center;
  z-index: 100;
  cursor: pointer;
  background: radial-gradient(circle at 90% 10%, #ffe900, #ffd700);
  box-shadow: inset 0 4px 10px rgba(0, 0, 0, 0.3),
    inset 0 -4px 10px rgba(255, 255, 255, 0.5);
`;

const InnerCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  opacity: 0.7;
  /* background: radial-gradient(circle at 50% 50%, #ffffff, #e0f7fa); */
  background-color: #ffffff;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1);
  /* box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1); 내부 그림자 */
`;

const ContentList = styled(motion.div)`
  position: absolute;
  /* top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled.div`
  position: absolute;
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  /* margin-bottom: 10px; */
  transform: rotate(${(props) => props.angle}) translate(130px)
    rotate(calc(-1 * ${(props) => props.angle}))
    rotate(calc(-1 * ${(props) => props.rotation}deg));

  span {
    font-size: 36px;
  }
  p {
    font-size: 12px;
  }
  &:last-child {
    position: relative;
    /* &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      height: 100px;
      background: #ccc;
      transform-origin: bottom;
      transform: rotate(-30deg);
      opacity: 0.5;
    }
    &::after {
      content: "";
      position: absolute;
      right: 0;
      top: 0;
      width: 1px;
      height: 100px;
      background: #ccc;
      transform-origin: bottom;
      transform: rotate(30deg);
      opacity: 0.5;
    } */
  }
`;

const MoSidebarList = ({ openList, variants, setWriteMode }) => {
  const containerDrag = useRef(null);
  const { darkmode, handleDarkmode } = useContext(DarkModeStateContext);
  const nevigate = useNavigate();

  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState(0);

  const handleClick = (e) => {
    e.stopPropagation();
    openList(e);
  };

  const handleWrite = (e) => {
    openList(e);
    setTimeout(() => {
      setWriteMode(true);
    }, 500);
  };

  const iconsList = [
    {
      label: "실시간 트렌드",
      icon: "local_fire_department",
      angle: "0deg",
    },
    {
      label: "친구",
      icon: "group",
      angle: "45deg",
    },
    {
      label: "그립",
      icon: "shopping_bag",
      angle: "90deg",
    },
    {
      label: "설정",
      icon: "settings",
      angle: "135deg",
    },
    {
      label: "프로필",
      icon: "account_circle",
      angle: "180deg",
      onClick: (e) => {
        nevigate("/profile");
        openList(e);
      },
    },
    {
      label: darkmode ? "라이트모드" : "다크모드",
      icon: darkmode ? "light_mode" : "dark_mode",
      angle: "225deg",
      onClick: handleDarkmode,
    },
    {
      label: "북마크",
      icon: "bookmark",
      angle: "315deg",
    },
    {
      label: "스토리 올리기",
      icon: "add_box",
      angle: "270deg",
      onClick: handleWrite,
    },
  ];

  const [rotation, setRotation] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleDragStart = useCallback((e) => {
    setStartX(e.clientX);
    setStartY(e.clientY);

    // console.log(e.offsetY);
  }, []);

  const handleDrag = useCallback(
    (e) => {
      if (startX !== null) {
        const deltaX = e.clientX - startX;
        const newRotation = deltaX * 0.05; // 더 자연스러운 회전 속도
        setVelocity(deltaX); // 속도를 기록
        setRotation((prev) => prev + newRotation);
      }
    },
    [startX]
  );

  const handleDragEnd = useCallback(() => {
    setStartX(null);
    let friction = 0.9;
    const decelerate = () => {
      setVelocity((prev) => {
        if (Math.abs(prev) < 0.01) return 0;
        setRotation((rot) => rot + prev * 0.05);
        return prev * friction;
      });
    };
    requestAnimationFrame(decelerate);
  }, []);

  return (
    <Wrapper onClick={handleClick}>
      <ContentWrapper
        variants={variants}
        initial="initial"
        animate="visible"
        exit="leaving"
        darkmode={darkmode}
        ref={containerDrag}
        onClick={(e) => e.stopPropagation()}
      >
        <ContentCenter onClick={handleClick}>
          <InnerCircle />
        </ContentCenter>
        <ContentList
          drag="false"
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          // dragSnapToOrigin
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          style={{ rotate: `${rotation}deg` }} // 드래그 회전 반영
        >
          {iconsList.map((icon, index) => (
            <Icon
              key={index}
              angle={icon.angle}
              rotation={rotation}
              onClick={icon.onClick}
              $flexProps
            >
              <span className="material-symbols-outlined">{icon.icon}</span>
              <p>{icon.label}</p>
            </Icon>
          ))}
        </ContentList>
      </ContentWrapper>
    </Wrapper>
  );
};

export default MoSidebarList;
