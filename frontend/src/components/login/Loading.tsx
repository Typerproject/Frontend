import React from "react";
import styled, { keyframes } from "styled-components";

const loadingF = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const LetterHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Letter = styled.div`
  float: left;
  font-size: 30px;
  color: #777;
  animation-name: ${loadingF};
  animation-duration: 1.6s;
  animation-iteration-count: infinite;
  animation-direction: linear;

  &.l-1 {
    animation-delay: 0.48s;
  }
  &.l-2 {
    animation-delay: 0.6s;
  }
  &.l-3 {
    animation-delay: 0.72s;
  }
  &.l-4 {
    animation-delay: 0.84s;
  }
  &.l-5 {
    animation-delay: 0.96s;
  }
  &.l-6 {
    animation-delay: 1.08s;
  }
  &.l-7 {
    animation-delay: 1.2s;
  }
  &.l-8 {
    animation-delay: 1.32s;
  }
  &.l-9 {
    animation-delay: 1.44s;
  }
  &.l-10 {
    animation-delay: 1.56s;
  }
`;

const LoadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 400px;
  margin: 0 auto;
  //   border-radius: 5px;
  text-align: center;
  //   background-color: #d8d8d8;
`;

const Loading: React.FC = () => {
  return (
    <LoadWrapper>
      <LetterHolder>
        <Letter className="l-1 letter">L</Letter>
        <Letter className="l-2 letter">o</Letter>
        <Letter className="l-3 letter">a</Letter>
        <Letter className="l-4 letter">d</Letter>
        <Letter className="l-5 letter">i</Letter>
        <Letter className="l-6 letter">n</Letter>
        <Letter className="l-7 letter">g</Letter>
        <Letter className="l-8 letter">.</Letter>
        <Letter className="l-9 letter">.</Letter>
        <Letter className="l-10 letter">.</Letter>
      </LetterHolder>
    </LoadWrapper>
  );
};

export default Loading;
