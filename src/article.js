import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Markdown from 'markdown-to-jsx';

import markdown from './article.md';

console.log(markdown);

const AppWrap = styled('div')`
  font-family: arial;
`;

const App = () => (
  <AppWrap>
    <Markdown>{markdown}</Markdown>
  </AppWrap>
);
ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
