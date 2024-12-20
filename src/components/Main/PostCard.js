import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import DetailModal from "../Detail/DetailModal/DetailModal";
import User from "./User";
import { DarkModeStateContext } from "../../App";
import { db } from "../../configs/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import PostForm from "./PostForm";

const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.bgSubColor};
`;

const Container = styled.div`
  width: 1406px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin: 60px 0 0 100px;
  padding: 0 20px;
  padding-left: 20%;
  @media screen and (max-width: 1760px) {
    width: 100%;
    padding-left: 10%;
  }
  @media screen and (max-width: 1460px) {
    padding-left: 5%;
  }
  @media screen and (max-width: 1190px) {
    padding-left: 5px;
  }
`;

const PostCard = () => {
  const { darkmode } = useContext(DarkModeStateContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);

  // console.log(selectedPost);

  useEffect(() => {
    const postsQuery = query(
      collection(db, "contents"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postData);
    });

    return () => unsubscribe();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const openModal = (postId) => {
    setSelectedPost(postId);
    setIsModalOpen(true);
  };

  return (
    <Wrapper>
      <Container>
        <User />
        <PostForm posts={posts} openModal={openModal} />
        {isModalOpen && selectedPost && (
          <DetailModal
            isOpen={isModalOpen}
            onClose={closeModal}
            postId={selectedPost}
          />
        )}
      </Container>
    </Wrapper>
  );
};

export default PostCard;
