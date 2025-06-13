/* eslint-disable react-hooks/exhaustive-deps */
import './styles/addManager.css'

import {useEffect, useState} from 'react';
import axios from 'axios';



function AddManager() {

  // Стани списку менеджерів
  const [managers, setManagers] = useState([]); // Список менеджерів
  const [findError, setFindError] = useState(''); // Логування помилок виводу списку менеджерів
  const [findName, setFindName] = useState(''); // Ім'я для пошуку

  // Стан інпутів для створення менеджерів
  const [logError, setLogError] = useState(true); // Колір логів
  const [log, setLog] = useState(''); // Логування при створенні
  const [name, setName] = useState(''); // Ім'я менеджера який буде створений
  const [password, setPassword] = useState(''); // Пароль менеджера який буде створений

  // Стан полів для редагування менеджерів
  const [optionsLogError, setOptionsLogError] = useState(false)
  const [optionsLog, setOptionsLog] = useState('') // Логування змін
  const [showManager, setShowManager] = useState(false);
  const [ManagerName, setManagerName] = useState('');
  const [ManagerPassword, setManagerPassword] = useState('');
  const [changeManagerID, setChangeManagerID] = useState('');
  const [deleteManagerModal, setDeleteManagerModal] = useState(false);


  
  const getManagers = async () => {
    const { data } = await axios.post("http://116.202.198.11/api/get/Managers")
    setManagers(data.managers);
  };
  useEffect(() => {
    getManagers()
  },[]);
  const FindManager = async () => {
    await axios.post("http://116.202.198.11/api/find/Manager", {name:findName})
    .then((data) => {
      setManagers(data.data.managers)
    })
    .catch((err) => {
      setFindError(err.response.data.error)
    })
  };
  const CleanInput = () => {
    setFindName('')
    getManagers();
    setFindError('')
  }
  const AddManager = async () => {
    await axios.post("http://116.202.198.11/api/add/Manager", {name:name, password:password})
    .then((data) => {
      setLog(data.data.message)
      getManagers()
      setLogError(false)
    })
    .catch((err) => {
      setLog(err.response.data.error)
      setLogError(true)
    })
  };
  const ChangeManager = async () => {
    await axios.post("http://116.202.198.11/api/find/change/Manager", {_id:changeManagerID, changedName:ManagerName, changedPassword:ManagerPassword})
    .then((data) => {
      getManagers()
      setOptionsLogError(false)
      setOptionsLog(data.data.message)
    })
    .catch((err) => {
      setOptionsLogError(true)
      setOptionsLog(err.response.data.error)
    })
  };
  const DeleteManager = async () => {
    setDeleteManagerModal(false)
    setShowManager(false)
    await axios.post("http://116.202.198.11/api/delete/Manager", { _id:changeManagerID });
    setManagers((prev) => prev.filter((mng: any) => mng._id !== changeManagerID));
  };
  const DeletModal = () => {
    if(deleteManagerModal){
      return (
        <div className="deleteModalManagerContainer">
          <h1>Ви впевнені що хочете видалити цього менеджера?</h1>
          <div className='deleteModalManagerButtons'>
            <button className="deleteModalButton" onClick={() => DeleteManager()}>Видалити</button>
            <button className="closeModalButton" onClick={() => setDeleteManagerModal(false)}>Відмінити</button>
          </div> 
        </div>
      );
    }else {
      return null
    }
  }
  
  

  return (
    <div className='addManagercontainer'>
      <div className='managerList'>
        <div className='filter'>
          <img onClick={() => FindManager()} className='inputButtonFind' style={{width: "1.5vw", height: "1.5vw"}} src={require("../icons/magnifier.png")} alt='' />
          <input value={findName} onChange={(name) => {setFindName(name.target.value); FindManager()}} className='filterInput' placeholder='Пошук менеджера'/>
          <img onClick={() => {CleanInput()}} className='inputButtonClean' src={require("../icons/letter-x.png")} alt=''/>
        </div>
        <div className='list'>
          {!findError ? 
            managers.slice().reverse().map((mng:any, index) => (
            <div 
              key={index} 
              onClick={() => {
                setShowManager(true); 
                setShowManager(true); 
                setManagerName(mng.name); 
                setManagerPassword(mng.adminPassword)
                setChangeManagerID(mng._id)
                setDeleteManagerModal(false)
                setOptionsLog('')
              }} 
              className="managerBlock"
            > 
              <img src={require('../icons/user.png')} alt=''/>
              <h1 className='managerName'>: {mng.name}</h1>
            </div>
            ))
            : 
            <h1 className='findErrorLog'>{findError}</h1>
          }
        </div>
      </div>
      <div className='addManagerForm'>
        <div className='addForm'>
          <h1>Додати менеджера</h1>
          <input className='addManagerInput' placeholder="Ім'я" value={name} onChange={(e) => setName(e.target.value)}/>
          <input className='addManagerInput' placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <h1 className='logs' style={ logError ?{color:'red'} : {color: 'green'}}>{log}</h1>
          <button onClick={() => AddManager()} className='addButton'>Додати</button>
        </div>
        {showManager ?
          <div className="managerOptions">
            <h1>Редагувати користувача</h1>
            <div className='managerOptionsContainer'>
              <div className='managerDataForm'>

                <div className='dataContainer'>
                  <img src={require('../icons/user.png')} alt=''/>
                  <h1>Ім'я:</h1>
                  <input 
                  value={ManagerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  />
                </div>
                <div className='dataContainer'>
                  <img src={require('../icons/padlock.png')} alt=''/>
                  <h1>Пароль:</h1>
                  <input 
                  value={ManagerPassword}
                  onChange={(e) => setManagerPassword(e.target.value)}
                  />
                </div>

              </div>
              <div className='optionButtons'>
                <button onClick={() => ChangeManager()} className='saveButton'>Зберегти</button>
                <button className='deleteButton' onClick={() => {setDeleteManagerModal(true)}}  >
                <img 
                  className='deleteButton' 
                  style={{width:'2.5vw', height:'2.5vw'}}
                  src={require('../icons/delete.png')} 
                  alt=''
                />
                </button>  
              </div>
            </div>
            <h1 style={optionsLogError ? {color:'red'} : {color: 'green'}}>
              {optionsLog}
            </h1>
          </div>
        :<h1 className='emptyText'>Виберіть користувача</h1>
        }
      </div>
      <DeletModal/>
    </div>
  )
}

export default AddManager