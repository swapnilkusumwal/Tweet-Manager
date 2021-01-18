import React from 'react';
import './index.css';

import {BrowserRouter} from 'react-router-dom';
import Main from "./component/Main";
function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default App;
