import React from "react";
import styled from "styled-components";

// Styled components for icons
const BookmarkIcon = styled.div`
  width: 16px;
  height: 16px;
  background-color: #ccc;
  border-radius: 10px;
`;

const CommentIcon = styled.div`
  width: 16px;
  height: 16px;
  background-color: #ccc;
  border-radius: 10px;
`;

const PostLoading: React.FC = () => {
  return (
    <>
      <div className="flex flex-row justify-between mb-4 mx-8 md:mx-[47px]">
        {/* 텍스트 */}
        <div className="flex-1 flex flex-col gap-4 md:h-[180px]">
          <div className="flex flex-row h-12 md:h-[46px] justify-between">
            <div className="w-12 h-12 md:w-[46px] md:h-[46px] rounded-full cursor-pointer bg-gray-200" />

            <div className="flex flex-row h-12 md:h-[46px] justify-between items-center flex-1 ml-4">
              <div className="w-20 h-8 md:w-20 md:h-[24px] inline-block mr-4 md:mr-12 bg-gray-200 rounded-md" />

              <div className="w-[160px] h-6 md:w-[160px] md:h-[19px] mr-4 md:mr-20 bg-gray-200 rounded-md" />
            </div>
          </div>
          <div className="bg-gray-200 w-52 h-9 md:h-[36px] rounded-md" />
          <div className="bg-gray-200 w-60 h-5 md:h-[21px] rounded-md" />

          <div className="flex items-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 md:gap-6">
              <BookmarkIcon />
            </div>
            <div className="flex items-center gap-2 md:gap-6">
              <CommentIcon />
            </div>
          </div>
        </div>

        {/* 이미지 */}
        <div className="hidden md:flex items-center">
          <div className="bg-gray-200 w-40 h-40 md:w-[330px] md:h-[180px] rounded-md" />
        </div>
      </div>
      <div className="w-full h-0.5 bg-gray-200 mb-4" />
    </>
  );
};

export default PostLoading;
