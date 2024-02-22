import React from 'react';
import styled, { keyframes } from 'styled-components';

const dropAnimation = keyframes`
  0% {
    top: -50%;
  }
  100% {
    top: 110%;
  }
`;

const Line = styled.div`
  position: absolute;
  width: 1px;
  height: 100%;
  top: 0;
  left: 50%;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    position: absolute;
    height: 15vh;
    width: 100%;
    top: -50%;
    left: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      var(--cui-primary) 75%,
      var(--cui-primary) 100%
    );
    animation: ${dropAnimation} 7s infinite;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(0.4, 0.26, 0, 0.97);
  }
`;

const Line1 = styled(Line)`
  margin-left: -25%;
  &::after {
    animation-delay: 2s;
  }
`;

const Line3 = styled(Line)`
  margin-left: 25%;
  &::after {
    animation-delay: 2.5s;
  }
`;

const Lines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  margin: auto;
  width: 90vw;
`;

const BgLines = () => {
    return (
        <Lines>
            <Line1 />
            <Line />
            <Line3 />
        </Lines>
    );
};

export default BgLines;
