import React from 'react';
import styled from 'styled-components';
import { media } from './utils/media';

import Loading from './Loading';

const KeyWrap = styled('div')`
  display: grid;
  justify-items: center;
  align-items: center;
  h2 {
    background-image: linear-gradient(
      to bottom right,
      hsl(205, 87%, 29%),
      hsl(205, 76%, 39%)
    );
    margin: 0 0 10px;
    padding: 20px 40px;
    border-radius: 5px 5px 0 0;
    color: #fff;
    font-weight: normal;
    letter-spacing: 0.8px;
  }
  > div {
    width: 80%;
    max-width: 960px;
    ${media.phablet`width: 90%;`}
    ${media.phone`width: 90%;`}
    border-radius: 5px;
    box-shadow: 0 5px 15px hsla(0, 0%, 0%, 0.2);
    box-sizing: border-box;
    background: white;
  }
`;

const Items = styled('div')`
  display: grid;
  grid: 1fr 1fr 1fr / repeat(5, 1fr);
  grid-auto-flow: column;
  grid-gap: 15px 0;
  padding-bottom: 20px;
  text-align: center;
  ${media.phablet`font-size:14px;`}
  ${media.phone`font-size:14px;`}
`;

const Item = styled('div')`
  display: grid;
  grid: 1fr 30px / 1fr;
  justify-items: center;
  img {
    width: 30px;
    height: 30px;
  }
`;

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

const Key = ({ animals = [] }) => {
  return (
    <KeyWrap>
      <div>
        <h2>Key</h2>
        {animals.length ? (
          <Items>
            {animals.map((name, idx) => (
              <Item key={idx}>
                <span>{name}</span>
                <span>
                  <img src={`${animalMap[name]}`} alt={name} />
                </span>
              </Item>
            ))}
          </Items>
        ) : (
          <Loading></Loading>
        )}
      </div>
    </KeyWrap>
  );
};

export default Key;

// export const fluidImage = graphql`
//   fragment fluidImage on File {
//     childImageSharp {
//       fluid(maxWidth: 50) {
//         ...GatsbyImageSharpFluid
//       }
//     }
//   }
// `

// export const pageQuery = graphql`
//   query {
//     imageOne: file(relativePath: { eq: "one.jpg" }) {
//       ...fluidImage
//     }
//     imageTwo: file(relativePath: { eq: "two.jpg" }) {
//       ...fluidImage
//     }
//     imageThree: file(relativePath: { eq: "three.jpg" }) {
//       ...fluidImage
//     }
//   }
// `
