import  React, { useState } from 'react';
import axios from 'axios';
import "./styles/log_in.css";
import { useStore } from '../context/Context';
import { useNavigate } from "react-router-dom";

function Log_in() {
  const navigate = useNavigate();
  const { setUserName, setLog_in } = useStore()
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [log, setLog] = useState('')
  const [status, setStatus] = useState('')

  const log_in = async () => {
    try {
      const res = await axios.post("http://116.202.198.11/api/Log_in", { name:name, password:password })
      setLog(res.data.message)
      setStatus("success")
      res.data.role === "manager" ? navigate("/Manager") : navigate("/Admin");
      setUserName(name);
      setLog_in(true)
    } catch (err:any) {
      setLog(err.response.data.error);
      setStatus("error");
      setLog_in(false);
    } 
  }

  return (
    <div className='log_inContainer'>
      <div className='log_inForm'>
        <h1 className='log_in_text'>Вхід</h1>
        <input className='log_in_input' placeholder="Ім'я" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <input className='log_in_input' placeholder='Пароль' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <h1 className='log_text' style={status === "success" ? {color:"green"} : {color:"red"}}>{log}</h1>
        <button className='sendButton' onClick={() => log_in()}>Вхід</button>
      </div>
    </div>
  )

}

export default Log_in