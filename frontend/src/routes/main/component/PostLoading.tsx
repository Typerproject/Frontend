import React from "react";
import styled from "styled-components";

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
      <div className="flex flex-row justify-between h-[180px] mb-4">
        {/* 텍스트 */}
        <div className="flex-1 h-[180px] flex flex-col gap-[10px] justify-between">
          <div className="flex flex-row w-full h-[46px] justify-between">
            <div className="w-[46px] h-[46px] rounded-full cursor-pointer bg-gray-200" />

            <div className="flex flex-row h-[46px] justify-between items-center flex-1 ml-4">
              <div className="w-20 h-[24px] inline-block mr-12 bg-gray-200 rounded-md" />

              <div className="w-[160px] h-[19px] mr-20 bg-gray-200 rounded-md" />
            </div>
          </div>
          <div className="bg-gray-200 w-[400px] h-[36px] rounded-md" />
          <div className="bg-gray-200 w-[450px] h-[21px] rounded-md" />

          <div className="flex items-center gap-[1.5rem]">
            <div className="flex items-center gap-[0.5rem]">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-[0.5rem]">
                  <BookmarkIcon />
                </div>
                <div className="flex items-center gap-[0.5rem]">
                  <CommentIcon />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 */}
        <div className="flex h-[180px] items-center mr-[16px]">
          <div className="bg-gray-200 w-[180px] h-[180px] rounded-md" />
        </div>
      </div>
      <div className="w-full h-[2px] bg-gray-200 mb-4" />
    </>
  );
};

export default PostLoading;
