import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import store from './store';
import HeartrateChart from './heartrateChart';

const AppWrap = styled('div')`
  font-family: arial;
`;

const App = () => (
  <AppWrap>
    <HeartrateChart model={store.chartModel}></HeartrateChart>
  </AppWrap>
);

ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
