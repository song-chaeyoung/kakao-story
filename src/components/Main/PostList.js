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

const Container = styled.div`
  display: flex;
`;

const PostList = () => {
  return (
    <Wrapper>
      <Container>
        <PostCard />
        {/* <Video /> */}
      </Container>
    </Wrapper>
  );
};
export default PostList;
