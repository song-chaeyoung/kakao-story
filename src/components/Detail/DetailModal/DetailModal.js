import React, { useContext, useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { getAuth } from "firebase/auth";
import { db } from "../../../configs/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import ModalOverlay from "./ModalOverlay";
import { lightTheme, darkTheme } from "../../../styles/Theme";
import { DarkModeStateContext } from "../../../App";
import EditModalPostform from "./EditModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// 모달 창 스타일
const ModalContent = styled.div`
  display: flex;
  position: fixed;
  width: 1060px;
  height: 730px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.fontColor};
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  z-index: 1001;
`;

const PostDetailImage = styled.div`
  width: 620px;
  height: 100%;
  background-position: center;
`;

const CommentsSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.fontColor};
  padding: 30px;
`;

const PostAuthorInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 12px;
`;

const AuthorProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const AuthorInfoText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const AuthorName = styled.p`
  font-weight: bold;
  margin: 0;
`;

const PostTime = styled.p`
  font-size: 12px;
  color: var(--main-gray);
  margin-left: 10px;
`;

const EditDeleteIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .icon {
    font-size: 24px;
    cursor: pointer;
    color: ${({ theme }) => theme.fontColor};

    &:hover {
      color: #ffe900; /* 아이콘에 hover 효과 추가 */
    }
  }
`;

const CommentList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  scrollbar-width: none;
`;

const Comment = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;
`;

const CommentLeft = styled.div`
  display: flex;
  gap: 15px;
`;

const CommentProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CommentUserName = styled.p`
  font-weight: bold;
  font-size: 14px;
  margin: 0;
`;

const CommentTime = styled.p`
  font-size: 12px;
  color: var(--main-gray);
  margin: 0;
`;

const CommentText = styled.p`
  font-size: 14px;
  margin-top: 5px;
`;

const CommentLikeIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => (props.isLiked ? "#FFE900" : props.theme.fontColor)};
  &:hover {
    color: ${(props) => (props.isLiked ? "#FFD700" : props.theme.fontColor)};
  }
`;

const CommentInputContainer = styled.div`
  display: flex;
  gap: 15px;
  border-top: 1px solid #ddd;
  padding-top: 15px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 12px;
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
  width: 100px;
  height: 45px;
  background-color: #ffe900;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
`;

const InteractionIconsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  align-items: center;
  padding-bottom: 10px;
`;

const Icon = styled.div`
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => (props.isLiked ? "#FFE900" : props.theme.fontColor)};
  &:hover {
    color: ${(props) => (props.isLiked ? "#FFD700" : props.theme.fontColor)};
  }
`;

const PostContent = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.5;
  color: ${({ theme }) => theme.fontColor};
`;

const StyledSwiper = styled(Swiper)`
  width: 620px;
  height: 730px;

  .swiper-button-prev,
  .swiper-button-next {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    padding: 40px;
    color: ${({ theme }) => theme.fontColor};
    transform: scale(0.4);
    transition: all 0.3s;
    background: rgba(255, 255, 255, 0.5);
  }

  .swiper-button-prev {
    left: 5px;
  }
  .swiper-button-next {
    right: 5px;
  }

  .swiper-pagination-bullet {
    background-color: ${({ theme }) => theme.fontColor};
  }

  .swiper-pagination-bullet-active {
    background-color: #ffe900;
  }
`;

const DetailModal = ({ isOpen, onClose, postId }) => {
  const { darkmode } = useContext(DarkModeStateContext);
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [likedComments, setLikedComments] = useState([]);
  const [likedPost, setLikedPost] = useState(false);
  const [userData, setUserData] = useState({});

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const getUserInfo = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      setUserData(data);
    }
  };

  const fetchPost = async () => {
    const postRef = doc(db, `contents/${postId}`);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      setPost(postDoc.data());
    } else {
      // console.log("문서가 없습니다!");
    }
  };

  useEffect(() => {
    fetchPost();
    if (post)
      setTimeout(() => {
        getUserInfo(post.postId);
      }, 100);
  }, [post]);

  // 댓글 작성 시 입력 변경 처리
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // 댓글 작성 처리
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return; // 빈 댓글 방지
    setIsSubmitting(true);

    try {
      const postRef = doc(db, "contents", postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const currentPost = postDoc.data();

        // 기존 댓글 배열에 새 댓글 추가
        const updatedComments = [
          ...currentPost.comments,
          {
            commentId: Date.now().toString(),
            userId: currentUser.displayName || currentUser.email.split("@")[0],
            commentUserImg: currentUser.photoURL || "/default-profile.png",
            content: newComment,
            createdAt: new Date().toISOString(),
          },
        ];

        // Firestore에 댓글 업데이트
        await updateDoc(postRef, {
          comments: updatedComments,
        });

        // 댓글 입력 후 상태 초기화
        setNewComment("");
        setPost((prevPost) => ({
          ...prevPost,
          comments: updatedComments,
        }));
      } else {
        // console.log("게시글을 찾을 수 없습니다!");
      }
    } catch (error) {
      console.error("댓글을 추가하는 중 오류 발생:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 좋아요 토글 처리
  const toggleLikeComment = (index) => {
    setLikedComments((prevLikedComments) => {
      const updatedLikes = [...prevLikedComments];
      updatedLikes[index] = !updatedLikes[index];
      return updatedLikes;
    });
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const postRef = doc(db, "contents", postId);
        await deleteDoc(postRef);
        onClose();
        alert("게시글이 삭제되었습니다.");
      } catch (error) {
        console.error("글 삭제중 오류 발생", error);
        alert("게시글 삭제에 실패하였습니다.");
      }
    }
  };

  const isPostOwner = currentUser && post && currentUser.uid === post.postId;

  const toggleLikePost = () => {
    setLikedPost((prevLikedPost) => !prevLikedPost);
  };

  const defaultProfileImage = "/testimages/default-profile.png";

  if (!post) return null;
  return (
    <ThemeProvider theme={darkmode ? darkTheme : lightTheme}>
      <ModalOverlay onClick={onClose} />
      <ModalContent>
        <StyledSwiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          {post.photo ? (
            <SwiperSlide>
              <PostDetailImage
                style={{
                  background: `url(${post.photo}) center/cover no-repeat`,
                }}
              />
            </SwiperSlide>
          ) : (
            <p>이미지가 없습니다.</p>
          )}
        </StyledSwiper>
        <CommentsSection>
          <PostAuthorInfo>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <AuthorProfileImage
                src={userData?.userPhoto || defaultProfileImage}
                alt={post.userName}
              />
              <AuthorInfoText>
                <AuthorName>{post.userName}</AuthorName>
                <PostTime>
                  {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                </PostTime>
              </AuthorInfoText>
            </div>
            {isPostOwner && (
              <EditDeleteIcons>
                {/* <span
                  className="material-symbols-outlined icon"
                  onClick={handleEdit}
                >
                  edit
                </span> */}
                <span
                  className="material-symbols-outlined icon"
                  onClick={() => handleDelete(postId)}
                >
                  delete
                </span>
              </EditDeleteIcons>
            )}
          </PostAuthorInfo>
          <PostContent>{post.post}</PostContent>

          {/* 댓글 섹션 */}
          <CommentList>
            {post?.comments && post?.comments?.length > 0 ? (
              post?.comments.map((comment, index) => (
                <Comment key={index}>
                  <CommentLeft>
                    <CommentProfileImage
                      src={comment?.commentUserImg || defaultProfileImage}
                      alt={comment?.userId}
                    />
                    <CommentContent>
                      <CommentHeader>
                        <CommentUserName>{comment?.userId}</CommentUserName>
                        <CommentTime>
                          {new Date(comment?.createdAt).toLocaleDateString(
                            "ko-KR"
                          )}
                        </CommentTime>
                      </CommentHeader>
                      <CommentText>{comment?.content}</CommentText>
                    </CommentContent>
                  </CommentLeft>
                  <CommentLikeIcon
                    isLiked={likedComments[index]}
                    onClick={() => toggleLikeComment(index)}
                  >
                    <i
                      className={
                        likedComments[index] === true
                          ? "fa-solid fa-heart"
                          : "fa-regular fa-heart"
                      }
                    ></i>
                  </CommentLikeIcon>
                </Comment>
              ))
            ) : (
              <p>댓글이 없습니다.</p>
            )}
          </CommentList>

          {/* 좋아요, 댓글, 공유 아이콘 */}
          <InteractionIconsContainer>
            <Icon isLiked={likedPost} onClick={toggleLikePost}>
              <span className="material-symbols-outlined">favorite</span>
            </Icon>
            <Icon>
              <span className="material-symbols-outlined">comment</span>
            </Icon>
            <Icon>
              <span className="material-symbols-outlined">share</span>
            </Icon>
          </InteractionIconsContainer>

          {/* 댓글 작성 섹션 */}
          <CommentInputContainer>
            <CommentInput
              value={newComment}
              onChange={handleCommentChange}
              placeholder="댓글 작성하기..."
            />
            <SubmitButton onClick={handleCommentSubmit} disabled={isSubmitting}>
              {isSubmitting ? "작성 중..." : "작성"}
            </SubmitButton>
          </CommentInputContainer>
        </CommentsSection>
      </ModalContent>
      {isEditModalOpen && (
        <EditModalPostform
          onClose={handleEditClose}
          postId={postId}
          currentText={post.post}
          userName={post.userName}
          userProfileImg={post.userProfileImg}
        />
      )}
    </ThemeProvider>
  );
};

export default DetailModal;
