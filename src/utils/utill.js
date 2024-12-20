import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const getPopularPosts = (data) => {
  const { popularPosts } = data;
  popularPosts.forEach(async (post) => {
    const {
      postId,
      userId,
      likes,
      userName,
      userProfileImg,
      content,
      createdAt,
      comments,
      postImg,
    } = post;

    try {
      const doc = await addDoc(collection(db, "popularPosts"), {
        postId,
        userId,
        likes,
        userName,
        userProfileImg,
        content,
        createdAt,
        comments,
        postImg,
      });
    } catch (error) {
      console.error(error);
    }
  });

  return popularPosts;
};

export default getPopularPosts;
