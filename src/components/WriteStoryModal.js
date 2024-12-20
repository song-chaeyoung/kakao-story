import React, { useState } from "react";
import styled from "styled-components";
import { addDoc, collection } from "firebase/firestore"; // Firebase Firestore에서 사용
// import { auth, db } from "../firebase"; // Firebase 설정에서 Firestore 가져오기
import { db } from "../configs/firebase";

// 스타일 정의
const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
`;

const WriteForm = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #ffe900;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #ddd;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const WriteStoryModal = ({ isOpen, onClose }) => {
  const [story, setStory] = useState(""); // 작성된 스토리 상태 관리
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  const handleInputChange = (e) => {
    setStory(e.target.value); // 입력값 업데이트
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 동작 방지

    if (!story) {
      alert("내용을 입력해 주세요!");
      return;
    }

    setIsLoading(true); // 로딩 상태 시작

    try {
      await addDoc(collection(db, "stories"), {
        content: story,
        createdAt: Date.now(),
      });
      alert("스토리가 성공적으로 업로드되었습니다!");
      setStory(""); // 제출 후 텍스트박스 비우기
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("스토리 업로드에 실패했습니다.");
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>오늘의 스토리를 들려주세요.</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <WriteForm onSubmit={handleSubmit}>
          <TextArea
            placeholder="오늘 하루, 기억하고 싶은 순간이 있나요?"
            value={story}
            onChange={handleInputChange}
          />
          <ActionButtons>
            <CancelButton onClick={onClose}>취소</CancelButton>
            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? "올리는 중..." : "올리기"}
            </SubmitButton>
          </ActionButtons>
        </WriteForm>
      </ModalContainer>
    </>
  );
};

export default WriteStoryModal;
