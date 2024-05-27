import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import {AuthProvider} from './context/Authprovi';


ReactDOM.render(
  <BrowserRouter>
  <AuthProvider>
    <App />
    </AuthProvider>
  </BrowserRouter>
  ,
  document.getElementById('root')
);
