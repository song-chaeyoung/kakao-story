import React from "react";
import styled from "styled-components";

const FriendWrapper = styled.div`
  min-width: 230px;
  height: 400px;
  position: sticky;
  top: 100px;
  padding: 30px 20px 20px;
  background: ${({ theme }) => theme.bgColor};
  color: ${({ theme }) => theme.fontColor};
  border-radius: 20px;
  h5 {
    font-size: 18px;
    text-align: center;
    letter-spacing: -1px;
    font-weight: 400;
    margin-bottom: 30px;
  }
  ul {
    /* height: 100%; */
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    gap: 20px;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .friendInfo {
        display: flex;
        gap: 10px;
        align-items: center;
        > div {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ddd;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      .followBtn {
        display: none;
      }
    }
  }
  @media screen and (max-width: 1600px) {
    display: none;
  }
  @media screen and (max-width: 768px) {
    display: block;
    margin-top: 30px;
    height: fit-content;
    position: static;
    h5 {
      text-align: start;
    }
    ul {
      flex-direction: row;
      justify-content: space-between;
      gap: 10px;
      li {
        flex-direction: column;
        gap: 10px;
        .friendInfo {
          flex-direction: column;
        }
        .followBtn {
          display: block;
          padding: 6px 10px;
          font-size: 12px;
          background: var(--point-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
`;

const OnoffChange = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  /* background: var(--point-color); */
  background: ${({ $stayUser }) => ($stayUser ? "var(--point-color)" : "#ccc")};
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const friendList = [
  {
    id: 0,
    name: "송채영",
    stayUser: false,
    img: "https://firebasestorage.googleapis.com/v0/b/kakaostory-b8662.appspot.com/o/userImg%2FprofileImg%2FEuOdQqQd8ARwW0ZIF95Pvk87ZH73?alt=media&token=9e15f469-f1da-4626-b27c-364266f243b2",
  },
  {
    id: 1,
    name: "해오름",
    stayUser: false,
  },
  {
    id: 2,
    name: "전진우",
    stayUser: true,
  },
  {
    id: 3,
    name: "강혜정",
    stayUser: false,
  },
  {
    id: 4,
    name: "김준영",
    stayUser: true,
  },
];

const ProfileFriend = () => {
  return (
    <FriendWrapper>
      <h5>추천친구</h5>
      <ul>
        {friendList.map((item) => (
          <li key={item.id}>
            <div className="friendInfo">
              <div>
                <img src={item.img} />
              </div>
              <p>{item.name}</p>
            </div>
            <OnoffChange $stayUser={item.stayUser}></OnoffChange>
            <div className="followBtn">팔로우</div>
          </li>
        ))}
      </ul>
    </FriendWrapper>
  );
};

export default ProfileFriend;
