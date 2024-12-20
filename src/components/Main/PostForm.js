import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { db } from "../../configs/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import Post from "./Post";
import { userKakaoCredentials } from "../../routes/KakaoRedirect";

const Wrapper = styled.div`
  width: 100%;
`;

const PostForm = ({ openModal }) => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(userKakaoCredentials);
  const userLogin = user.isLoggedIn;

  useEffect(() => {
    if (!userLogin) {
      const popularQuery = query(
        collection(db, "popularPosts"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(popularQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));

        setPosts(postsData);
      });

      return () => unsubscribe();
    } else {
      const postsQuery = query(
        collection(db, "contents"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(postsData);
      });

      return () => unsubscribe();
    }
  }, [userLogin]);

  return (
    <Wrapper>
      {posts.map((postData) => (
        <Post key={postData.id} postData={postData} openModal={openModal} />
      ))}
    </Wrapper>
  );
};

export default PostForm;
