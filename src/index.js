import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import HeartrateChart from './heartrateChart';

const App = () => (
  <div className="App">
    <HeartrateChart model={store.chartModel}></HeartrateChart>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
