import React from 'react';
import styled, { keyframes } from 'styled-components';
import { prop, withProp } from 'styled-tools';

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
`;

const ImageWrap = styled('g')``;

const animalMap = {
  Human:
    'https://heartrates.tedspace.me/static/8f0a74d0b575cd3ce699b9d4815151d1/e35b7/icons8-human2-50.png',
  Cat:
    'https://heartrates.tedspace.me/static/45775748290fa55b77620216838b9695/09f8c/icons8-cat-butt-50.png',
  'Small dog':
    'https://heartrates.tedspace.me/static/f39b47301ccef2dc3e7354073fb0432b/09f8c/icons8-pug-50.png',
  'Medium dog':
    'https://heartrates.tedspace.me/static/56ca3148cd746a6c3ea935c2c9113116/09f8c/icons8-corgi-50.png',
  'Large dog':
    'https://heartrates.tedspace.me/static/372a438b68bff9fd135616c72982af2e/09f8c/icons8-german-shepherd-50.png',
  Hamster:
    'https://heartrates.tedspace.me/static/300afff6f3cab16e07e03cbc58275047/09f8c/icons8-cute-hamster-50.png',
  Chicken:
    'https://heartrates.tedspace.me/static/dfd2103c64aff883b824f5b278476193/09f8c/icons8-chicken-50.png',
  Monkey:
    'https://heartrates.tedspace.me/static/bc451718f3734fd6ebb9926031c3ef06/f04ed/icons8-monkey-50.png',
  Horse:
    'https://heartrates.tedspace.me/static/9c7e6ed1de8f43e793644431ab13b157/09f8c/icons8-horse-50.png',
  Cow:
    'https://heartrates.tedspace.me/static/ac3aa22f5d83b33d3665c8dab32a7f77/09f8c/icons8-cow-50.png',
  Pig:
    'https://heartrates.tedspace.me/static/73f736a52f34eb1c853ff326e9998ada/09f8c/icons8-pig-50.png',
  Rabbit:
    'https://heartrates.tedspace.me/static/d71d03ac0221a7f1b6e389c3f03049b8/09f8c/icons8-rabbit-50.png',
  Elephant:
    'https://heartrates.tedspace.me/static/b4ea8f9bddb27c4b89a3dacc15b23326/09f8c/icons8-elephant-50.png',
  Giraffe:
    'https://heartrates.tedspace.me/static/6b2ba197a1535a657b580c1eb1740bca/09f8c/icons8-giraffe-50.png',
  'Large whale':
    'https://heartrates.tedspace.me/static/504974fe1fb58553f80d008b22953496/09f8c/icons8-whale-50.png'
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
              <image
                href={`${animalMap[label]}`}
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
