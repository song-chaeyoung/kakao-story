import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, storage } from "../../configs/firebase";
import styled from "styled-components";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 30%;
  max-width: 100%;
  /* max-height: 90%; */
  border-radius: 20px;
  overflow: hidden;
  > video {
    object-fit: cover;
    width: 100%;
    height: auto;
    border-radius: 20px;
    display: block;
  }
`;

const fetchAndStoreVideoUrls = async () => {
  const storage = getStorage();
  const storageRef = ref(storage, "shotVideo"); // 비디오가 저장된 경로

  try {
    // 해당 경로의 모든 파일 목록 가져오기
    const listResult = await listAll(storageRef);

    // 각 파일에 대해 URL 가져오기 및 Firestore에 저장
    for (const item of listResult.items) {
      const url = await getDownloadURL(item); // 파일의 다운로드 URL 가져오기

      // Firestore에 URL 추가
      await addDoc(collection(db, "shortVideo"), {
        src: url, // 비디오 URL 저장
        createdAt: Date.now(), // 생성 시간 추가
        comments: [],
      });
    }

    console.log("모든 비디오 URL이 Firestore에 추가되었습니다.");
  } catch (err) {
    console.error("오류 발생:", err);
  }
};

const VideoTest = () => {
  const [videos, setVideos] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [isNowNumber, setIsNowNumber] = useState(0);

  const fetchVideos = async () => {
    let videoQuery = query(collection(db, "shortVideo"), limit(2)); // 쿼리 생성

    if (lastVisible) {
      videoQuery = query(
        collection(db, "shortVideo"),
        startAfter(lastVisible),
        limit(2)
      ); // 마지막 문서 이후부터 가져오기
    }

    const querySnapshot = await getDocs(videoQuery); // 쿼리 실행

    const videoList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      src: doc.data().src,
      poster: doc.data().poster,
      comments: doc.data().comments || [],
    }));

    setVideos((prevVideos) => [...prevVideos, ...videoList]); // 기존 비디오 목록에 추가
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // 마지막 문서 업데이트
  };

  console.log(videos);
  
  useEffect(() => {
    fetchVideos();
  }, []);

  if (videos.length === 0) return null;

  return (
    <Container>
      <VideoContainer>
        <video
          src={`${videos[isNowNumber].src}`}
          poster={`${videos[isNowNumber].poster}`}
        />
      </VideoContainer>
    </Container>
  );
};

export default VideoTest;
