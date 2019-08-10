import React from 'react';
import styled, { keyframes } from 'styled-components';
import { prop, withProp } from 'styled-tools';
import Img from './svgimg';

const pulse = keyframes`
  0% {
    filter: drop-shadow( 0 0 1px rgba(204,169,44, 1));
    opacity: 0.3;
  }
  70% {
    filter: drop-shadow( 0 0 10px rgba(204,169,44, 1 ));

    opacity: 1;
  }
  100% {
     
    
    filter: drop-shadow( 0 0 0 rgba(204,169,44, 1 ));
      opacity: 0;
  }
`;
const pulse2 = keyframes`
 0% {
    box-shadow: 0 0 0 0 hsla(9, 100%, 64%, 0.9);
  }
  70% {
      box-shadow: 0 0 0 20px hsla(9, 100%, 64%, 0.7);
  }
  100% {
      box-shadow: 0 0 0 0 hsla(9, 100%, 64%, 0.9);
  }
`;
const pulse3 = keyframes`
 0% {
    box-shadow: 0 0 0 0 rgba(255,99,71 ,0.9 ));
    transform: scale(0.1)
  }
  70% {
      box-shadow: 0 0 0 2px rgba(255,99,71 ,0.7 );
    transform: scale(0.7) ;
  }
  100% {
      box-shadow: 0 0 0 0 rgba(255,99,71 ,0.9);
    transform: scale(0.1)
  }
`;

const PointsWrap = styled('svg')`
  display: grid;
  grid: 1fr / 1fr;
  justify-items: center;
  position: absolute;
  height: 600px;
  width: 100%;
  top: 0;
  left: 0;
  line {
    stroke: #d8d8d8;
  }
`;

const Blinker = styled.div`
  position: absolute;
  top: ${prop('top')}px;
  left: ${prop('left')}px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  animation: ${pulse2} ${withProp(['duration'], duration => `${duration}ms`)}
    linear infinite;
    /* transform: scale(0.1) translateX(-25%) translateY(-25%);
  transform-origin:50% 50%;
  animation: ${pulse3} ${withProp(['duration'], duration => `${duration}ms`)}
    linear infinite; */
   
  /* &:before,
  &:after {
    position: absolute;
    content: '';
    left: 2px;
    top: -25px;
    width: 50px;
    height: 80px;
    background:hsla(9, 100%, 74%, 1);
    -moz-border-radius: 50px 50px 0 0;
    border-radius: 50px 50px 0 0;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transform-origin: 0 100%;
    -moz-transform-origin: 0 100%;
    -ms-transform-origin: 0 100%;
    -o-transform-origin: 0 100%;
    transform-origin: 0 100%;

    
    linear infinite;
  }
  &:after {
    left: -48px;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-transform-origin: 100% 100%;
    -moz-transform-origin: 100% 100%;
    -ms-transform-origin: 100% 100%;
    -o-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
  } */
`;

const ImageWrap = styled('g')`
  image {
    /* animation: ${pulse} ${withProp(
  ['duration'],
  duration => `${duration}ms`
)}
      linear infinite; */
  }
`;

const animalMap = {
  Human: 'human',
  Cat: 'cat-butt',
  'Small dog': 'pug',
  'Medium dog': 'corgi',
  'Large dog': 'german-shepherd',
  Hamster: 'cute-hamster',
  Chicken: 'chicken',
  Monkey: 'monkey',
  Horse: 'horse',
  Cow: 'cow',
  Pig: 'pig',
  Rabbit: 'rabbit',
  Elephant: 'elephant',
  Giraffe: 'giraffe',
  'Large whale': 'whale'
};

const Points = ({ points = [] }) => {
  return (
    <>
      {points.map(({ x, y, label, pulse }, i) => (
        <Blinker key={i} top={y - 4} duration={pulse} left={x - 4}></Blinker>
      ))}
      <PointsWrap>
        {points.map(({ x, y, label, pulse }, i) => (
          <g key={i}>
            {/* <circle fill={'red'} cx={x} cy={y} r="10" key={i} />
          <text x={x} y={y + 11}>
            {label}
          </text>
          <image xlink:href="firefox.jpg" x="0" y="0" height="50px" width="50px"/> */}
            {/* <rect x={x} y={y} height={30} width={30} /> */}
            <ImageWrap duration={pulse}>
              <Img
                filename={`icons8-${animalMap[label]}-50.png`}
                x={x - 15}
                y={y - 15}
                height={30}
                width={30}
                alt={label}
              />
            </ImageWrap>

            {/* <path
            d={`M${x},${y} ${x + 30},${y + 30}`}
            style={{ filter: 'url(#shadow);' }}
          /> */}
          </g>
        ))}
      </PointsWrap>
    </>
  );
};

export default Points;
