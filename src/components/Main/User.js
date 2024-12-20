import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useEffect } from "react";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../../configs/firebase";

// 모달 스타일
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 350px;
  height: 90vh;
  background: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StoryXMark = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 1.3rem;
  color: #fff;
`;

const StoryTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StoryMiddleRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
  border: 1px solid;
`;

const StoryBottomRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const StoryUserNames = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 100;
`;

const StoryImg = styled.video`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #eee;
  border: 1px solid #ffe900;
  z-index: 100;
`;

const StoryUserName = styled.div`
  z-index: 100;
`;

const StoryTopRowItems = styled.div`
  display: flex;
  gap: 20px;
  z-index: 100;
`;

const StoryTextarea = styled.input`
  padding: 10px 75px 10px 15px;
  border-radius: 20px;
  z-index: 100;
`;

const Wrapper = styled.div`
  width: 950px;
  height: 150px;
  overflow: hidden; /* 콘텐츠가 영역을 넘어가면 숨김 */
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    margin-top: 60px;
  }
`;

const StoryListMain = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  @media screen and (max-width: 768px) {
    gap: 6px;
  }
`;

const Story = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column; /* 수직 방향으로 배치 */
  align-items: center; /* 가운데 정렬 */
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #eee;
  border: 2px solid #ffe900;
  margin-right: 10px; /* 간격 설정 */
  cursor: pointer;

  span {
    margin-top: 85px; /* 아이템과 이름 간격 */
    font-size: 14px; /* 글자 크기 */
    text-align: center; /* 가운데 정렬 */
    color: ${({ theme }) => theme.fontColor};
  }
`;

const StoryThumbnail = styled.video`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  object-fit: cover;
`;

const StoryVid = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

function StoryMain() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allStoryVideos, setAllStoryVideos] = useState([]);
  const itemsPerPage = 8; // 한 페이지에 보이는 아이템 수
  const totalItems = allStoryVideos.length;
  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragStartIndex = useRef(0);

  // 모달 상태
  const [storyVid, setStoryVid] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [storyList, setStoryList] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    dragStartIndex.current = currentIndex;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const distance = e.clientX - startX.current;
    const threshold = 200; // 드래그 거리 기준
    const newIndex =
      dragStartIndex.current +
      (distance > threshold ? -1 : distance < -threshold ? 1 : 0);

    // 경계 조건 확인
    if (newIndex >= 0 && newIndex <= totalItems - itemsPerPage) {
      setCurrentIndex(newIndex);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false; // 마우스가 나가면 드래그 종료
  };

  const handleStoryClick = (story) => {
    setSelectedStory(story);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStory(null);
  };

  const getStoryVidData = async () => {
    try {
      const storyVidRef = doc(db, `storyvideo/${selectedStory?.id}`);
      const storyVids = await getDoc(storyVidRef);

      if (storyVids) {
        const data = storyVids.data();
        // console.log(data);
        setStoryVid(data);
        // console.log(test);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getAllStoryDatas = async () => {
    try {
      const storyAllVidsRef = query(collection(db, "storyvideo"));
      const storyAllVids = await getDocs(storyAllVidsRef);
      let datas = [];
      const data = storyAllVids.docs.map((video) => {
        const src = video.data();
        datas.push(src);
      });
      console.log(data);
      // console.log(datas);
      setAllStoryVideos(datas);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllStoryDatas();
  }, []);

  useEffect(() => {
    getStoryVidData();
    console.log(selectedStory);
  }, [selectedStory]);

  // console.log(selectedStory);

  return (
    <>
      <Wrapper
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <StoryListMain drag="x" dragConstraints={{ left: -1350, right: 0 }}>
          {allStoryVideos?.map((item) => (
            <Story key={item.id} onClick={() => handleStoryClick(item)}>
              <StoryThumbnail src={item.videoURL} muted />
              <span>{item?.name}</span> {/* 이름 추가 */}
            </Story>
          ))}
        </StoryListMain>
      </Wrapper>
      {modalOpen && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <StoryTopRow>
              <StoryUserNames>
                <StoryImg src={selectedStory?.videoURL} muted></StoryImg>
                <StoryUserName>{selectedStory?.name}</StoryUserName>
              </StoryUserNames>
              <StoryTopRowItems>
                {/* <i className="fa-solid fa-volume-xmark"></i> */}
                <i className="fa-solid fa-ellipsis"></i>
              </StoryTopRowItems>
            </StoryTopRow>
            <StoryMiddleRow>
              <StoryVid src={selectedStory?.videoURL} controls />
            </StoryMiddleRow>
            <StoryBottomRow>
              <StoryTextarea
                placeholder={`${selectedStory.name}님에게 답장하기`}
              />
              <i className="fa-regular fa-heart"></i>
              <i className="fa-regular fa-paper-plane"></i>
            </StoryBottomRow>
          </ModalContent>
          <StoryXMark onClick={closeModal}>
            <i className="fa-solid fa-xmark"></i>
          </StoryXMark>
        </Modal>
      )}
    </>
  );
}

export default StoryMain;
