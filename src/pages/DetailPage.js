import React from "react";
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>상세 페이지 - {id}</h1>
      <p>이곳은 게시물 {id}의 상세 정보가 표시되는 페이지입니다.</p>
    </div>
  );
};

export default DetailPage;
