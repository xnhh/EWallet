import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Views/Main';
import NotistackWrapper from './Components/NotistackWrapper'
import NetworkProvider from './Contexts/Network'

function AllProvider () {
  return (
    <NotistackWrapper>
      <NetworkProvider>
        <Main />
      </NetworkProvider>
    </NotistackWrapper>
  );
}

ReactDOM.render(
  <AllProvider />,
  document.getElementById('root')
);

