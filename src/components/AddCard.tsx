/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import './styles/addCard.css'
import axios from 'axios';
import { useStore } from '../context/Context';
import './styles/showCard.css'
import ShowCard from './ShowCard';
import FilterCard from './FilterCard';


function AddCard() {
  const env = process.env as any;
  const today = new Date().toISOString().split("T")[0];
  const { 
    userName,  
    cards, 
    setCards,
    showCard, 
    setShowCard,
    setShowCardDataLog,
    formData, 
    setFormData,
    setShowSaveChangesButton,
    showFilter, 
    setShowFilter,
    fileName, 
    setFileName,
    file, 
    setFile,
    pdfURL, 
    setPdfURL,
    setShowCardPDF,
    getCardError, 
    setGetCardError,
    setAdditions,
    setShowAddition,
    showAddition
  } = useStore();
  const initialFormData = {
    _id: "",
    docId: "",
    docType: "",
    docNumber: "",
    docCreateDate: "",
    docSigningDate: "",
    name: "",
    validityPeriod: "",
    organizationName: "",
    organisationCode: "",
    counterpartyName: "",
    counterpartyCode: "",
    content: "",
    contractType: "",
    author: userName,
    createDate: reverseWord(today),
  };



  const [showApproveModal, setShowApproveModal] = useState(false); // Стан модального вікна
  const [createCardLog, setCreateCardLog] = useState(''); // Логування при створення нових карток
  const [createCardError, setCreateCardError] = useState(false); // Зміна кольору логу при створенні картки 
  const [fileLog, setFileLog] = useState(false);




  const GetCards = async () => {
    await axios.get(env.REACT_APP_GET_CARDS)
    .then((data) => {
      setCards(data.data.cards)
    })
    .catch((err) => {
      setGetCardError(err.response.data.error)
    })
  };
  const GetAdditions = async (_id:any) => {
    await axios.post(env.REACT_APP_GET_ADDITIONCARDS, {docId:_id})
    .then((data) => {
      setAdditions(data.data.data)
      console.log(data)
    })
    .catch((err) => {
      console.log(err.response.data.error)
    })
  }
  const handleFileChoose = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files?.[0];
      setFileName(file.name);
      setFile(e.target.files[0]);
      setPdfURL(URL.createObjectURL(e.target.files[0]));
    }
  };
  function reverseWord(str: string): string {
    return str
      .split('-')
      .reverse()
      .join('-');
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (["docCreateDate", "docSigningDate", "validityPeriod"].includes(name)) {
      const [year, month, day] = value.split("-");
      setFormData({ ...formData, [name]: `${day}-${month}-${year}` });
    } else {
      setFormData({ ...formData, [name]: value });
    }

  }; 
  const formatDateForInput = (date: string): string => {
    if (!date) return "";
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };
  const cleanInputs = () => {
    setFormData(initialFormData)
  }
  const createCard = async () => {
    console.log(formData)
    const data = new FormData();
    Object.entries(formData as Record<string, any>).forEach(([key, value]) => {
      data.append(key, value)
    })
    data.append("docPDF", file);
    await axios.post(env.REACT_APP_ADD_CARD_OR_ADDITION, data)
    .then(() => {
      setCreateCardError(false)
      setShowApproveModal(false)
      cleanInputs()
      setCreateCardLog('')
    })
    .catch((err) => {
      setCreateCardLog(err.response.data.error)
      setCreateCardError(true)
    })
    GetCards()
  };
  const openApproveModal = () => {
    if(pdfURL){
      setShowApproveModal(true)
      setFileLog(false)
    }
    else {
      setFileLog(true)
    }
  }
  const choiceFilter = () => {
    setShowFilter(true); 
    setShowCard(false); 
    cleanInputs()
    setShowAddition(false)
  }
  const choiseListCard = (card:any) => {
    setShowCard(true); 
    setFormData({...card});
    setShowCardPDF((prev: any) => ({ ...prev, fileName: card.docPDF }));
    setShowCardDataLog('');
    setFile('');
    setFileName('');
    setShowSaveChangesButton(false);
    setShowAddition(false);
    GetAdditions(card._id);
  }

  return (
    <div className='addCardContainer'>
      <div className='cardListContainer'>
        <div className='cardListTitle'>
          <h1>Фільтрувати архів</h1>
          <button onClick={() => choiceFilter()}><img src={require('../icons/filter.png')} alt=''/></button>
        </div>
        <div className='cardList'>
        {!getCardError ? 
          cards.slice().reverse().map((card:any, index:any) => (
          <div key={index} onClick={() => choiseListCard(card)} className='CardBlock'>
            <div className='cardBlockDateContainer'>
              <h1>Організація: {card.organizationName}</h1>
              <h1>Дата створення: {card.docCreateDate}</h1>
              <h1>Срок дії до: {card.validityPeriod}</h1>
            </div>
          </div>
          ))
          :(<h1>{getCardError}</h1>)
        }
        </div>
      </div>
      {!showFilter ? (
        <div className='addCardForm'>
          {!showApproveModal ? (
           <>
            {showAddition ? 
              (<h1>Створити додаток</h1>) : 
              (<h1>Додати картку документу</h1>)
            }
            <div className='addCardFormInput'>
              <div className='inputsContainer'>
  
              <div className='addInput'>
                <h1>Тип Договору:</h1>
                <select 
                  name='docType' 
                  value={formData.docType} 
                  onChange={handleChange}>
                  <option value="">Тип Договору</option>
                  <option value="Продаж">Продаж</option>
                  <option value="Замовлення">Замовлення</option>
                  <option value="Надання послуг">Надання послуг</option>
                  <option value="Отримання послуг">Отримання послуг</option>
                </select>
              </div>
  
              <div className='addInput'>
                <h1>Дата створення:</h1>
                <input 
                  type='date' 
                  name='docCreateDate' 
                  value={formatDateForInput(formData.docCreateDate)} 
                  onChange={handleChange} 
                  placeholder='дата створення'
                />
              </div>
  
              <div className='addInput'>
                <h1>Дата підписання:</h1>
                <input 
                  type='date' 
                  name='docSigningDate' 
                  value={formatDateForInput(formData.docSigningDate)}
                  onChange={handleChange}  
                  placeholder='дата підписання'
                />
              </div>
  
              <div className='addInput'>
                <h1>Срок дії:</h1>
                <input 
                  type='date' 
                  name='validityPeriod'
                  value={formatDateForInput(formData.validityPeriod)}
                  onChange={handleChange} 
                  placeholder='Срок дії'
                />
              </div>
  
              </div>
              <div className='inputsContainer'>
              
              <div className='addInput'>
                <h1>Найменування:</h1>
                <input 
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Найменування'
                />
              </div>
              <div className='addInput'>
                <h1>Найменування організації:</h1>
                <input 
                  name='organizationName'
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder='Найменування організації'
                />
              </div>
              <div className='addInput'>
                <h1>Код ЄДРПОУ організації:</h1>
                <input
                  type='number'
                  name='organisationCode'
                  value={formData.organisationCode}
                  onChange={handleChange}
                  placeholder='Код ЄДРПОУ організації'
                />
              </div>
              <div className='addInput'>
                <h1>Код ЄДРПОУ контрагента:</h1>
                <input 
                  type='number'
                  name='counterpartyCode' 
                  value={formData.counterpartyCode} 
                  onChange={handleChange}
                  placeholder='Код ЄДРПОУ контрагента'
                />
              </div>
  
              </div>
              <div className='inputsContainer'>
  
              <div className='addInput'>
                <h1>Тип Документа:</h1>
                <select 
                  name='contractType'
                  value={formData.contractType}
                  onChange={handleChange}
                  >
                  <option value="">Тип Документа</option>
                  <option value="Договір">Договір</option>
                  <option value="Наказ">Наказ</option>
                </select>
              </div>
  
              <div className='addInput'>
                <h1>Особистий номер:</h1>
                <input 
                  type='number'
                  name='docNumber'
                  value={formData.docNumber}
                  onChange={handleChange}
                  placeholder='Особистий номер документу'
                />
              </div>
              
              <div className='addInput'>
                <h1>Найменування контрагенту:</h1>
                <input 
                  name='counterpartyName'
                  value={formData.counterpartyName}
                  onChange={handleChange}
                  placeholder='Найменування контрагенту'
                />
              </div>
  
              </div>
              </div>
              <div className="choosePDFContainer">
                  <input 
                    id="pdfUpload" 
                    type="file" 
                    accept="application/pdf" 
                    onChange={handleFileChoose} 
                    style={{ display: "none" }} 
                  />
                  <label htmlFor="pdfUpload" className="custom-file-label">
                    Виберіть файл
                  </label>
                  <span>{fileName}</span>
              </div>
              <div className='contentContainer'>
                  <h1>Короткий зміст:</h1>
                  <textarea
                    name='content'
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Введіть текст..."
                  />
              </div> 
              {fileLog && <h1 style={{color:'red', fontSize:"1vw", margin:0, marginTop:0}}>❌ Файл не вибраний!</h1>}
              <div className='addButtons'>
                <button onClick={() => openApproveModal()}>Додати</button>
            </div>
           </>
          ):(
            <>
               <div className='addCardFormHeader'>
                <button onClick={() => setShowApproveModal(false)}>←</button>
                <h1>Перевірка даних</h1>
               </div>
               <div className='approveModalContainer'>
                <div className='sendDataContainer'>
                 <h1>Найменування: {formData.name}</h1>
                 <h1>Автор: {userName}</h1>
                 <h1>Тип документу: {formData.contractType}</h1>
                 <h1>Тип договору: {formData.docType}</h1>
                 <h1>Тип найменування: {formData.counterpartyName}</h1>
                 <h1>Найменування контерагента: {formData.counterpartyCode}</h1>
                 <h1>Дата створення: {formData.docCreateDate}</h1>
                 <h1>Дата підписання: {formData.docSigningDate}</h1>
                 <h1>Срок дії: {formData.validityPeriod}</h1>
                 <h1>Найменування організації: {formData.organizationName}</h1>
                 <h1>Код ЄДРПОУ організації: {formData.organisationCode}</h1>
                 <h1>Короткий зміст:</h1>
                 <h1 className='approveModalContent'>{formData.content}</h1>
                </div>
                <div className='logContainer'>
                </div>
                {pdfURL && (
                  <iframe className='pdfDocContainer' src={pdfURL}/>
                )}
               </div>
               <h1 id='approvedLog'  style={ createCardError ? {color:'red'} : {color:'green'}}>{createCardLog}</h1>
               <div className='addButtons'>
                  <button onClick={() => {createCard();  setShowAddition(false); showAddition && setFormData(initialFormData)}}>Додати</button>
               </div>
            </>
          )}
        </div>
      ):(
        <FilterCard/>
      )}
      {showCard && (
        <ShowCard/>
      )}
    </div>
  )
}

export default AddCard