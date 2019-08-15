import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { observer, useObservable, useObserver } from 'mobx-react-lite';
import { compose } from 'ramda';

import Key from './Key';
import Axes from './Axes';
import Points from './Points';
import Loading from './Loading';

const ChartWrap = styled('div')`
  margin-top: 50px;
  width: 100%;
  position: relative;
  text-align: center;
  h2 {
    background-image: linear-gradient(
      to bottom right,
      hsl(205, 87%, 29%),
      hsl(205, 76%, 39%)
    );
    margin: 0 0 10px;
    padding: 20px 40px;
    border-radius: 5px 5px 0 0;
    text-align: left;
    color: #fff;
    font-weight: normal;
    letter-spacing: 0.8px;
  }
  > div {
    width: 80%;
    max-width: 960px;
    border-radius: 5px;
    box-shadow: 0 5px 15px hsla(0, 0%, 0%, 0.2);
    box-sizing: border-box;
    background: white;
    margin: 0 auto;
    > div {
      position: relative;
    }
  }
`;

const Credit = styled.div`
  padding: 20px;
  text-align: left;
  a {
    text-decoration: underline;
    color: hsl(205, 82%, 33%);
  }
  margin-bottom: 30px;
`;

const HeartrateChart = ({ model }) => {
  const targetRef = useRef();
  useEffect(() => {
    const { width } = targetRef.current.getBoundingClientRect();
    console.log({ width });
    model.setUpScales({ width });
  }, []);
  console.log(model.toJSON());
  return (
    <>
      <Key
        animals={model.animals.length !== 0 ? model.animalsSorted() : []}
      ></Key>
      <ChartWrap>
        <div ref={targetRef}>
          <h2>Resting Heartrate vs Longevity of animal</h2>
          {model.ready ? (
            <div>
              <Axes
                yTicks={model.heartAxis()}
                xTicks={model.longevityAxis()}
                xLabel="Longevity (years)"
                yLabel="Resting heartrate (BPM)"
              ></Axes>
              <Points points={model.longevityPoints()}></Points>
            </div>
          ) : (
            <Loading></Loading>
          )}
        </div>
      </ChartWrap>
    </>
  );
};

export default observer(HeartrateChart);
