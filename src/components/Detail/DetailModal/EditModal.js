import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../../../configs/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Wrapper = styled.div``;

const Overlay = styled.div`
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const EditModal = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 10px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2001;
  @media screen and (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
`;

const TopBar = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  border-bottom: 1px solid #f1f1f1;
`;

const ButtonBar = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const EditImg = styled.img`
  width: 65%;
  height: 63vh;
  border-right: 2px solid #f1f1f1;
  object-fit: cover;
  @media screen and (max-width: 768px) {
    border: none;
    width: 100%;
    height: 45vh;
  }
`;

const EditDesc = styled.div`
  width: 35%;
  height: 63vh;
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media screen and (max-width: 768px) {
    border: none;
    width: 100%;
    height: 43vh;
  }
`;

const EditNames = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
`;

const EditUserImg = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid #f00;
`;

const EditUserName = styled.div`
  font-size: 1rem;
  color: #000;
  padding: 10px;
`;

const EditTextArea = styled.textarea`
  height: 200px;
  padding: 10px;
  border: none;
`;

const EditButtons = styled.div`
  display: flex;
  justify-content: space-around;
`;

const CancelButton = styled.button`
  border: none;
  padding: 7px 25px;
`;

const CompleteButton = styled.button`
  border: none;
  padding: 7px 25px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  top: 25px;
  right: 20px;
  font-size: 25px;
  color: #fff;
`;

const EditModalPostform = ({ onClose, postId }) => {
  const [editText, setEditText] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [photo, setPhoto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPostData = async () => {
    try {
      const postRef = doc(db, "contents", postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();
        setEditText(postData.post || "");
        setUserName(postData.userName || "");
        setUserImage(postData.userProfileImg || "");
        setPhoto(postData.photo || "");
      } else {
        // console.log("해당 문서가 존재하지 않습니다.");
      }
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostData();
    }
  }, [postId]);

  const handleChange = (e) => {
    setEditText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!editText.trim()) return;

    setIsSubmitting(true);

    try {
      const postRef = doc(db, "contents", postId);
      await updateDoc(postRef, {
        post: editText,
      });
      alert("수정 완료되었습니다.");
      onClose();
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Overlay>
        <EditModal>
          <TopBar>
            <div>내 스토리 수정</div>
          </TopBar>
          <ButtonBar>
            <EditImg src={photo} alt="게시글 이미지" />
            <EditDesc>
              <EditNames>
                <EditUserImg src={userImage} alt="사용자 이미지" />
                <EditUserName>{userName}</EditUserName>
              </EditNames>
              <EditTextArea
                value={editText}
                onChange={handleChange}
                placeholder="내용을 입력하세요"
              />
              <EditButtons>
                <CancelButton onClick={onClose}>취소</CancelButton>
                <CompleteButton onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "저장 중..." : "완료"}
                </CompleteButton>
              </EditButtons>
            </EditDesc>
          </ButtonBar>
        </EditModal>
        <DeleteButton onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </DeleteButton>
      </Overlay>
    </Wrapper>
  );
};

export default EditModalPostform;
