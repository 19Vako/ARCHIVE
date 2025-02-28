import { useState } from 'react';
import "./styles/admin.css";
import Header from '../components/Header';
import AddManager from '../components/AddManager';
import AddCard from '../components/AddCard';


function Admin() {
  const [addCardOrUser, setaddCardOrUser] = useState(true)

  return (
    <div className='adminContainer'>
      <Header />
      <nav className='choiseOption'>
        <button style={ addCardOrUser ? {background: '#004884'} : {background:'none'}} className='addManager' onClick={() => setaddCardOrUser(true)}>Додати менеджера <img src={require('../icons/userIcon.png')} alt=''/></button>
        <button style={ !addCardOrUser ? {background: '#004884'} : {background:'none'}} className='addCard' onClick={() => setaddCardOrUser(false)}><img src={require('../icons/inbox-icon.png')} alt=''/> Додати картку</button>
      </nav>

      <main className='mainContainer'>
        {addCardOrUser ? <AddManager/> : <AddCard/>}
      </main>
      
    </div>
  )
}

export default Admin