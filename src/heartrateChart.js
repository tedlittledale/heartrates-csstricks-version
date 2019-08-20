import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { observer, useObservable, useObserver } from 'mobx-react-lite';

import Key from './Key';
import Axes from './Axes';
import Points from './Points';
import Loading from './Loading';
import Dropdown from './Dropdown';

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
    text-align: center;
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
  const chartTitles = [
    'Resting Heartrate vs Longevity of animal',
    'Resting Heartrate vs Weight of Animal',
    'Longevity of Animal vs Weight of Animal'
  ];
  const xAxisLabels = [
    'Longevity (years)',
    'Weight (KG) (log scale)',
    'Weight (KG) (log scale)'
  ];
  const yAxisLabels = [
    'Resting Heart rate (BPM)',
    'Resting Heart rate (BPM)',
    'Longevity (years)'
  ];
  const updateScales = () => {
    const { width } = targetRef.current.getBoundingClientRect();
    console.log({ width });
    model.setUpScales({ width });
  };
  useEffect(() => {
    updateScales();
    window.addEventListener('resize', updateScales);
    return () => {
      window.removeEventListener('resize', updateScales);
    };
  }, []);
  return (
    <>
      <ChartWrap>
        <div ref={targetRef}>
          <h2>
            <Dropdown>
              <select
                onChange={e =>
                  model.setSelectedAxes(parseInt(e.target.value, 10))
                }
                defaultValue={model.selectedAxes}
              >
                {chartTitles.map((title, idx) => (
                  <option key={idx} value={idx}>
                    {chartTitles[idx]}
                  </option>
                ))}
              </select>
            </Dropdown>
          </h2>

          {model.ready ? (
            <div>
              <Axes
                yTicks={model.getYAxis()}
                xTicks={model.getXAxis()}
                xLabel={xAxisLabels[model.selectedAxes]}
                yLabel={yAxisLabels[model.selectedAxes]}
                paddingAndMargins={model.paddingAndMargins}
              ></Axes>
              <Points points={model.getPoints()}></Points>
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
