import React from 'react'
import './styles/addCard.css'
import axios from 'axios';
import { useStore } from '../context/Context';
import './styles/showCard.css'
import './styles/addAddition.css'


function AddAddition() {
  const { 
     setShowCard, 
     setShowCardDataLog,
     formData, 
     setFormData,
     setShowSaveChangesButton,
     showSaveChangesButton,
     setFileName,
     file,
     setFile,
     setShowCardPDF,
     additions,
     setAdditions,
     setShowAddAddition,
     showAddAdditionData,
     showAddAdditionCardPDF, 
     addAdditionLog, 
     setAddAdditionLog
  } = useStore()
  const GetAdditions = async (_id:any) => {
    await axios.post("http://116.202.198.11/api/get/Additions", {docId:_id})
    .then((data) => {
      setAdditions(data.data.data)
    })
    .catch((err) => {
      console.log(err.response.data.error)
    })
  }
  const handleChangeCard = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setShowSaveChangesButton(true)
  }
  const addAddition = async () => {
    await axios.post("http://116.202.198.11/api/add/Addition", {docId:formData._id, additionDocId:showAddAdditionData._id})
    .then(() => {
      setShowAddAddition(false);
      GetAdditions(formData._id)
    })
    .catch((err) => {
      console.log(err.response.data.error)
      setAddAdditionLog(err.response.data.error)
    })
  }


  return (
    <>
      <div className='cardContainerBlock'>
        <div className='cardDataButtons'>
          <div className='cardDataButtonsContainer'>
              
            <button id='addAddition' onClick={() => {addAddition()}}>
              Додати як посилання
            </button>
            <button className='deleteCard' onClick={() => {setShowAddAddition(false);}}>
              Відмінити
            </button>
            <h1 style={{marginBottom: "1vw", fontSize: "1vw"}}>{addAdditionLog}</h1>
            
          </div>
          <div className='additionList'>
            {additions ? (
                  additions.slice().reverse().map((card:any, index:any) => (
                    <div key={index} className='additionBlockContainer'>
                      <h1>Організація: {card.organizationName}</h1>
                      <h1>Дата створення: {card.docCreateDate}</h1>
                      <h1>Срок дії до: {card.validityPeriod}</h1>
                    </div>
                  ))
              ):(<h1>❌ Список посилань пустий</h1>)
            }
          </div>
        </div>
        {showAddAdditionData._id && 
          <>
           <div className='cardDataContainerBox' style={{height: "34.3vw"}}>
            <div className='cardDataContainer'>

                   <div className='cardDataTitle'>
                    <h1>Найменування:</h1>
                    <p>{showAddAdditionData.name}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Автор:</h1>
                    <p>{showAddAdditionData.author}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Тип договору:</h1>
                    <p>{showAddAdditionData.contractType}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Тип документу:</h1>
                    <p>{showAddAdditionData.docType}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Найменування:</h1>
                    <p>{showAddAdditionData.counterpartyName}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Найменування контерагента:</h1>
                    <p>{showAddAdditionData.counterpartyCode}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Дата створення:</h1>
                    <p>{showAddAdditionData.docCreateDate}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Дата підписання:</h1>
                    <p>{showAddAdditionData.docSigningDate}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Срок дії до:</h1>
                    <p>{showAddAdditionData.validityPeriod}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Найменування організації:</h1>
                    <p>{showAddAdditionData.organizationName}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Код ЄДРПОУ організації:</h1>
                    <p>{showAddAdditionData.organisationCode}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Код ЄДРПОУ контрагента:</h1>
                    <p>{showAddAdditionData.counterpartyCode}</p>
                   </div>

            </div>
           </div>
          </>
        }
      </div>
      <div className='cardDataTitleContent'>
        <h1>Короткий зміст:</h1>
          <textarea
            name='content'
            value={formData.content}
            onChange={handleChangeCard}
          />
      </div>
      <iframe 
        className='cardPdfDocContainer'
        title='Doc' 
        src={`${showAddAdditionCardPDF.nameHostAndPort}${showAddAdditionCardPDF.fileName}`}
      />
    </> 
  )
}

export default AddAddition