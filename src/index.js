import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import NotistackWrapper from './Components/NotistackWrapper'

ReactDOM.render(
    <NotistackWrapper>
        <App />
    </NotistackWrapper>
    ,
  document.getElementById('root')
);

