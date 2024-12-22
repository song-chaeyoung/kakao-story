import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { db, userAuth } from "../../configs/firebase"; // Firebase 설정 파일
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";

const VideoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  /* padding-top: 230px; */
  /* padding-right: 10px; */
  /* padding-left: 30px; */
  /* margin-bottom: 30px; */
  background: ${({ theme }) => theme.bgSubColor};
`;
const VideosContainer = styled.div`
  position: relative;
`;

const Videos = styled.video`
  width: 100%;
  max-width: 260px;
  margin-top: 40px;
  height: 390px;
  background: #fff;
  background: ${({ theme }) => theme.bgSubColor};
  border-radius: 20px;
  cursor: pointer;
  object-fit: cover;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContent = styled(motion.div)`
  position: relative;
  width: 30%;
  max-width: 100%;
  max-height: 90%;
  border-radius: 20px;
  overflow: hidden;
`;
const VideoElement = styled.video`
  width: 100%;
  height: auto;
  border-radius: 20px;
  display: block;
`;
const Videocomment = styled.input`
  position: absolute;
  bottom: 14px;
  left: 12%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  width: 65%;
  outline: none;
  background: none;
  border: 1px solid #efefef;
  color: #fff;
`;
const VideoText = styled.div`
  position: absolute;
  bottom: 10%;
  left: 12%;
  color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  height: 190px;
  overflow: hidden;
  justify-content: end;
`;
const CommentText = styled(motion.p)`
  margin: 0;
  position: relative;
`;
const Commentt = styled.i`
  position: absolute;
  bottom: 2.5%;
  left: 3%;
  font-size: 26px;
  color: #fff;
  cursor: pointer;
  &:hover {
    color: #ffe900;
  }
`;

const Heart = styled.i`
  position: absolute;
  bottom: 2.5%;
  right: 14%;
  font-size: 26px;
  color: #fff;
  cursor: pointer;
  &:hover {
    color: #ffe900;
  }
`;

const Plane = styled.i`
  position: absolute;
  bottom: 2.5%;
  right: 4%;
  font-size: 26px;
  color: #fff;
  cursor: pointer;
  &:hover {
    color: #ffe900;
  }
`;

const ProgressBarContainer = styled.div`
  position: absolute;
  top: 10px; // 비디오 아래에 위치
  left: 12%;
  width: 65%; // 너비 조정
  height: 5px; // 바의 높이
  background: rgba(255, 255, 255, 0.3); // 배경 색상
  border-radius: 5px; // 모서리 둥글게
  overflow: hidden; // 자식 요소가 컨테이너를 넘지 않도록
`;
const ProgressBar = styled(motion.div)`
  height: 100%; // 컨테이너와 같은 높이
  background: #ffe900; // 바 색상
  width: 0; // 초기 너비
  transition: width 0.8s ease-in-out; // 애니메이션 효과
`;

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState("");
  const videoRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false); // 댓글 표시 상태
  const [progressWidth, setProgressWidth] = useState(0);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const querySnapshot = await getDocs(collection(db, "shotVideos"));
      const videoList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        src: doc.data().src,
        poster: doc.data().poster,
        comments: doc.data().comments || [],
      }));
      setVideos(videoList);
    };
    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    setCurrentVideo(video.src);
    setCurrentVideoId(video.id);
    setIsModalOpen(true);
    const videoDocRef = doc(db, "shotVideos", video.id);
    const unsubscribe = onSnapshot(videoDocRef, (doc) => {
      setComments(doc.data().comments || []);
    });
    return () => unsubscribe();
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentVideo("");
    setInputValue("");
    setComments([]);
    setProgressWidth(0);
    setShowComments(false); // 모달 닫을 때 댓글 상태 초기화
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };
  const handleCommentChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const videoDocRef = doc(db, "shotVideos", currentVideoId);
      const user = userAuth.currentUser;
      if (user) {
        const commentWithUser = `${
          user.displayName || user.email
        }: ${inputValue}`;
        await updateDoc(videoDocRef, {
          comments: arrayUnion(commentWithUser),
        });
        setInputValue("");
      } else {
        // console.log("사용자가 로그인하지 않았습니다.");
      }
    }
  };
  const toggleComments = () => {
    setShowComments((prev) => !prev); // 댓글 표시 상태 토글
  };
  useEffect(() => {
    if (isModalOpen && videoRef.current) {
      videoRef.current.play();
      const updateProgressBar = () => {
        if (videoRef.current) {
          const duration = videoRef.current.duration;
          const currentTime = videoRef.current.currentTime;
          if (duration > 0) {
            setProgressWidth((currentTime / duration) * 100);
          }
        }
      };
      progressIntervalRef.current = setInterval(updateProgressBar, 1000);
      return () => clearInterval(progressIntervalRef.current);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isModalOpen]);
  return (
    <>
      <VideoList>
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideosContainer key={video.id}>
              <Videos
                src={video.src}
                loop
                onClick={() => handleVideoClick(video)}
                poster={video.poster}
              />
            </VideosContainer>
          ))
        ) : (
          <p>비디오가 없습니다.</p>
        )}
      </VideoList>
      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <VideoElement ref={videoRef} loop>
                <source src={currentVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </VideoElement>
              <form
                onSubmit={handleCommentSubmit}
                onClick={(e) => e.stopPropagation()}
              >
                <Videocomment
                  value={inputValue}
                  type="text"
                  placeholder="댓글 입력..."
                  onChange={handleCommentChange}
                  autoFocus
                />
                <Commentt
                  className="fa-regular fa-comment"
                  onClick={toggleComments}
                />
                <Heart className="fa-solid fa-heart" />
                <Plane className="fa-regular fa-paper-plane" />
                <button type="submit" style={{ display: "none" }} />
              </form>
              <VideoText>
                <AnimatePresence>
                  {showComments &&
                    comments.map((comment, index) => (
                      <CommentText
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                      >
                        {comment}
                      </CommentText>
                    ))}
                </AnimatePresence>
              </VideoText>
              <ProgressBarContainer>
                <ProgressBar style={{ width: `${progressWidth}%` }} />
              </ProgressBarContainer>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};
export default Video;
