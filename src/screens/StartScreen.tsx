import React from 'react'
import "./styles/startScreen.css"
import { Link } from 'react-router-dom'

function StartScreen() {
  return (
    <div className='choiseContainer'>
        <div className='form'>
            <h1 className='choiseText'>Увійти як</h1>
            <Link to='/Manager_log_in' className='choiseButton'>Менеджер</Link>
            <Link to='/Admin_log_in' className='choiseButton'>Адмін</Link>
        </div>
    </div>
  )
}

export default StartScreen