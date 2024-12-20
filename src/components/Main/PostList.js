import React from "react";
import PostCard from "./PostCard";
import styled from "styled-components";
import Video from "./Video";

const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) =>
    theme.bgColor === "var(--main-dark)" ? "#222" : theme.bgColor};
  background: #f1f1f1;
`;

const Gototop = styled.a`
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fae100;
  color: #fff;
  font-size: 30px;
  text-align: center;
  line-height: 50px;
  position: fixed;
  top: 85%;
  right: 30px;
  padding-top: 5px;
  opacity: 0;
  transition: all 0.3s;
  z-index: 100;
  cursor: pointer;
  &.active {
    opacity: 1;
    bottom: 20px;
  }
`;

const Container = styled.div`
  display: flex;
`;
const PostList = () => {
  return (
    <Wrapper>
      <Container>
        <PostCard />
        <Video />
        <Gototop
          className="active"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <i className="fa-solid fa-chevron-up"></i>
        </Gototop>
      </Container>
    </Wrapper>
  );
};
export default PostList;
