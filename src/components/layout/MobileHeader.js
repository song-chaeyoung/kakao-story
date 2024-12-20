import React from "react";
import styled from "styled-components";
import { mixins } from "../../styles/GlobalStyles.styles";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  /* background: #fff; */
  background: ${({ theme }) => theme.bgColor};
  border-bottom: 1px solid #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  z-index: 10;
`;
const KakaoLogo = styled.div`
  width: 148px;
  height: 32px;
`;
const HeaderIcons = styled.div`
  display: flex;
  gap: 18px;
`;
const BellIconHeader = styled.button`
  font-size: 20px;
  border: none;
  background: none;
  position: relative;
  color: ${({ theme }) => theme.fontColor};
  &:hover {
    color: #fae100;
  }
  .fa-circle {
    font-size: 7px;
    color: #fae100;
    position: absolute;
    top: 3px;
  }
`;
const PersonIconHeader = styled.button`
  font-size: 20px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.fontColor};
  &:hover {
    color: #fae100;
  }
`;
function MobileHeader() {
  return (
    <Wrapper>
      <KakaoLogo />
      <HeaderIcons>
        <BellIconHeader>
          <i className="fa-regular fa-bell"></i>
          <div>
            <i className="fa-solid fa-circle"></i>
          </div>
        </BellIconHeader>
        <PersonIconHeader>
          <i className="fa-regular fa-circle-user"></i>
        </PersonIconHeader>
      </HeaderIcons>
    </Wrapper>
  );
}
export default MobileHeader;
