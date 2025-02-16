/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import "./App.css";
import { Routes, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';

import Manager_log_in from './screens/Manager_log_in';
import Admin_log_in from './screens/Admin_log_in';
import Manager from './screens/Manager';
import Admin from './screens/Admin';
import StartScreen from './screens/StartScreen';
import { Provider } from './context/Context';


function App() {
  return (
    <div className="AppContainer">
      <Provider>
        <Router>
          <Routes>
            <Route path='/' element={<StartScreen/>}/>
            <Route path='/Manager_log_in' element={<Manager_log_in/>}/>
            <Route path='/Admin_log_in' element={<Admin_log_in/>}/>
            <Route path='/Manager' element={<Manager/>}/>
            <Route path='/Admin' element={<Admin/>}/>
          </Routes>
        </Router>
      </Provider>
    </div>
  )
}

export default App;
