import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../../../styles/Theme";
import { DarkModeStateContext } from "../../../App";
import { db } from "../../../configs/firebase";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

const ModalWrapper = styled(motion.div)`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 90%;
  background-color: ${({ theme }) => theme.bgColor};
  border-radius: 20px 20px 0 0;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  padding: 15px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.fontColor};
  padding: 10px;
  font-size: 18px;
  border-bottom: 1px solid ${({ theme }) => theme.fontColor};
`;

const CloseButton = styled.div`
  cursor: pointer;
  font-size: 24px;
`;

const Content = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  scrollbar-width: none;
`;

const Comment = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const CommentLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CommentProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
`;

const CommentText = styled.div`
  background-color: ${({ theme }) => theme.bgSubColor};
  padding: 10px;
  border-radius: 10px;
  color: ${({ theme }) => theme.fontColor};
  font-size: 14px;
  flex: 1;
`;

const LikeIcon = styled.i`
  cursor: pointer;
  font-size: 18px;
  color: ${({ liked }) => (liked ? "#FFE900" : "#ccc")};
  &:hover {
    color: #ffe900;
  }
`;

const CommentInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-top: 1px solid ${({ theme }) => theme.fontColor};
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: ${({ theme }) => theme.bgSubColor};
  color: ${({ theme }) => theme.fontColor};
  font-size: 16px;
  &:focus {
    outline: none;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 15px;
  background-color: #ffe900;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
`;

const modalVariants = {
  hidden: { y: "100%" },
  visible: {
    y: "0%",
    transition: {
      delay: 0.2,
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    y: "100%",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const MobileModal = ({ isOpen, onClose, postId }) => {
  const { darkmode } = useContext(DarkModeStateContext);
  const [post, setPost] = useState(null); // post 데이터를 저장할 상태
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (postId) {
      // console.log("Post ID:", postId);
      const postRef = doc(db, "contents", postId);
      const unsubscribe = onSnapshot(postRef, (doc) => {
        if (doc.exists()) {
          const postData = doc.data();
          // console.log("Post Data:", postData);
          setPost(postData); // post 데이터를 설정
          setComments(postData.comments || []);
        } else {
          // console.log("문서가 없습니다!");
        }
      });

      return () => unsubscribe();
    }
  }, [postId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      const postRef = doc(db, "contents", postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const currentPost = postDoc.data();

        const updatedComments = [
          ...currentPost.comments,
          {
            commentId: Date.now().toString(),
            userId: currentUser.displayName || "익명",
            commentUserImg: currentUser.photoURL || "/default-profile.png",
            content: newComment,
            createdAt: new Date().toISOString(),
          },
        ];

        await updateDoc(postRef, {
          comments: updatedComments,
        });

        setNewComment("");
      } else {
        // console.log("게시글을 찾을 수 없습니다!");
      }
    } catch (error) {
      console.error("댓글 추가 중 오류 발생:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !post) return null; // post 데이터가 없으면 모달을 표시하지 않음

  return (
    <ThemeProvider theme={darkmode ? darkTheme : lightTheme}>
      <Overlay onClick={onClose} />
      <ModalWrapper
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(event, info) => {
          if (info.offset.y > 100) {
            onClose();
          }
        }}
      >
        <Header>
          <div>댓글 {comments.length}</div>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        <Content>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <Comment key={comment.commentId}>
                <CommentLeft>
                  <CommentProfileImage
                    src={comment.commentUserImg || "/default-profile.png"}
                  />
                  <CommentText>
                    <strong>{comment.userId}</strong>
                    <p>{comment.content}</p>
                  </CommentText>
                </CommentLeft>
                <LikeIcon className="fa-regular fa-heart" />
              </Comment>
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </Content>
        <CommentInputContainer>
          <CommentInput
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글 작성하기..."
          />
          <SubmitButton onClick={handleCommentSubmit} disabled={isSubmitting}>
            {isSubmitting ? "작성 중..." : "작성"}
          </SubmitButton>
        </CommentInputContainer>
      </ModalWrapper>
    </ThemeProvider>
  );
};

export default MobileModal;
