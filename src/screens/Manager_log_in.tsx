import  React, { useState } from 'react';
import axios from 'axios';
import "./styles/log_in.css";
import { useStore } from '../context/Context';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Manager_log_in() {
  const env = process.env as any;
  const navigate = useNavigate();
  const { setUserName } = useStore()
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [log, setLog] = useState('')
  const [status, setStatus] = useState('')

  const log_in = async () => {
    try {
      const res = await axios.post(env.REACT_APP_MANAGER_LOG_IN, { name:name, password:password })
      setUserName(res.data.data.name)
      setLog(res.data.message)
      setStatus("success")
      navigate("/Manager")
    } catch (err:any) {
      setLog(err.response.data.error);
      setStatus("error")
    } 
  }

  return (
    <div className='log_inContainer'>
      <div className='log_inForm'>
        <div className='back_button_container'>
          <Link className='back_button' to='/'>←</Link>
        </div>
        <h1 className='log_in_text'>Вхід</h1>
        <input className='log_in_input' placeholder="Ім'я" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <input className='log_in_input' placeholder='Пароль' type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
        <h1 className='log_text' style={status === "success" ? {color:"green"} : {color:"red"}}>{log}</h1>
        <button className='sendButton' onClick={() => log_in()}>Вхід</button>
      </div>
    </div>
  )

}

export default Manager_log_in