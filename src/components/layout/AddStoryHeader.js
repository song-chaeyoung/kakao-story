import React, { useRef, useState } from "react";
import styled from "styled-components";
import { db, storage } from "../../configs/firebase";
import { userAuth } from "../../configs/firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Overlay = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  position: absolute;
  background: none;
  justify-content: center;
  align-items: center;
  top: 60px;
  left: 0;
  @media screen and (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 120;
    backdrop-filter: blur(2px);
    cursor: pointer;
  }
`;

const StoryContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  min-height: 250px;
  border: 1px solid #fae100;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.fontColor};
  border-radius: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  padding: 15px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  @media screen and (max-width: 1080px) {
    width: 400px;
  }
  @media screen and (max-width: 768px) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 94%;
    height: 400px;
    padding: 30px;
  }
`;

const AddstoryModal = styled.textarea`
  background: transparent;
  font-size: 18px;
  font-style: "$kakaoBig";
  color: ${({ theme }) => theme.fontColor};
  resize: none;
  border: none;
  width: 100%;
  height: 100%;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  &:focus {
    outline: none;
  }
`;

const AddStoryOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddStoryIcons = styled.div`
  /* width: 132px; */
  /* height: 25px; */
  display: flex;
  gap: 20px;
  padding-top: 6px;
  input {
    display: none;
  }
  label {
    width: 25px;
    height: 25px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      color: ${({ theme }) => theme.fontColor};
      transition: all 0.3s;
      font-size: 20px;
      &:hover {
        color: #fae100;
      }
    }
  }
  @media screen and (max-width: 768px) {
    gap: 10px;
    label {
      i {
        font-size: 16px;
      }
    }
  }
`;

const AddStoryButtons = styled.div`
  display: flex;
  gap: 10px;
  button {
    width: 70px;
    height: 30px;
    &:hover {
      cursor: pointer;
    }
  }
`;

const CancelAddStoryButton = styled.button`
  background: none;
  border: 1px solid #ccc;
  color: #ccc;
  transition: all 0.3s;
  &:hover {
    border: 1px solid #eee;
  }
`;

const UploadAddStoryButton = styled.button`
  background: #fae100;
  border: none;
  color: #fff;
`;

const AddStoryHeader = ({ setWriteMode }) => {
  const [post, setPost] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const maxFileSize = 7 * 1024 * 1024;

  const closeModal = () => {
    setWriteMode(false);
  };

  const onFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > maxFileSize) {
        alert("업로드할 수 있는 최대 용량은 7MB입니다!");
        return;
      }
      setFile(files[0]);
    }
  };

  const onSubmit = async (e) => {
    const user = userAuth.currentUser;

    if (post === "") alert("오늘의 스토리를 작성해주세요.");

    if (isLoading || post === "" || post.length > 180) return;

    if (!file) {
      alert("이미지를 올려야 업로드 할 수 있어요!");
      return;
    }

    try {
      setIsLoading(true);

      const docRef = await addDoc(collection(db, "contents"), {
        postId: user.uid,
        userId: user.email,
        userName: user.displayName || user.email.split("@")[0],
        post,
        createdAt: Date.now(),
        likes: 0,
        comments: [],
      });

      if (file) {
        const locationRef = ref(storage, `contents/postsImg/${docRef.id}`);
        
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        const fileType = file.type;
        if (fileType.startsWith("image/")) {
          await updateDoc(docRef, { photo: url });
        } else if (fileType.startsWith("video/")) {
          await updateDoc(docRef, { video: url });
        }
      }

      setPost("");
      setFile(null);
      setWriteMode(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Overlay onClick={closeModal}>
      <StoryContainer onClick={(e) => e.stopPropagation()}>
        <AddstoryModal
          placeholder="오늘하루 기억하고 싶은 순간이있나요?"
          onChange={(e) => setPost(e.target.value)}
        />
        <AddStoryOptions>
          <AddStoryIcons>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={onFileChange}
            />
            <label htmlFor="photo">
              <i className="fa-solid fa-camera"></i>
            </label>
            <input type="file" id="music" accept="audio/*" />
            <label htmlFor="music">
              <i className="fa-solid fa-music"></i>
            </label>
            <input type="file" id="link" />
            <label htmlFor="link">
              <i className="fa-solid fa-link"></i>
            </label>
          </AddStoryIcons>
          <AddStoryButtons>
            <CancelAddStoryButton onClick={closeModal}>
              취소
            </CancelAddStoryButton>
            <UploadAddStoryButton onClick={onSubmit}>
              {isLoading ? "업로드 중 ..." : "올리기"}
            </UploadAddStoryButton>
          </AddStoryButtons>
        </AddStoryOptions>
      </StoryContainer>
    </Overlay>
  );
};
export default AddStoryHeader;
