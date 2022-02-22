import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Views/Main';
import NotistackWrapper from './Components/NotistackWrapper'
import GlobalProvider from './Contexts/GlobalProvider'
import StorageProvider from './Contexts/StorageProvider'

function AllProvider () {
  return (
    <NotistackWrapper>
      <GlobalProvider>
        <StorageProvider>
          <Main />
        </StorageProvider>
      </GlobalProvider>
    </NotistackWrapper>
  );
}

ReactDOM.render(
  <AllProvider />,
  document.getElementById('root')
);

