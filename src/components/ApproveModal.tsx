/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useStore } from '../context/Context';
import '../components/styles/addCard.css'
import '../screens/styles/manager.css'
import { today, reverseWord } from '../utils/Utils';



function ApproveModal() {

  const {
    userName,  
    setCards,
    formData, 
    setFormData,
    setFileName,
    file, 
    setFile,
    pdfURL, 
    setGetCardError,
    setShowAddition,
    showAddition,
    setFilterFormData,
    setShowApproveModal,
    setPage,
    setLoading,
    setHasMore
  } = useStore();

  useEffect(() => {
      if (userName) {
        setFormData((prev: any) => ({
          ...prev,
          author: userName,
          createDate: reverseWord(today)
        }));
      }
  }, [userName, setFormData]);
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
  const [createCardLog, setCreateCardLog] = useState('');
  const [createCardError, setCreateCardError] = useState(false);


  const GetCards = async () => {
    setLoading(true);
    setGetCardError(null);
    try {
      const res = await axios.post("http://116.202.198.11/api/get/Cards", {page: 1, limit: 50});
      const newCards = res.data.cards || [];
      setCards(newCards); // просто ставим новые карточки
      setHasMore(newCards.length === 50); // true если ровно 50 карточек
      setPage(1);

    } catch (err: any) {
      setGetCardError(err?.response?.data?.error || 'Помилка при завантаженні карток');
    } finally {
      setLoading(false);
    }
  } 
  const cleanInputs = () => {
    setFilterFormData(initialFormData)
    setFormData(initialFormData)
  }
  const createCard = async () => {
    const data = new FormData();
    Object.entries(formData as Record<string, any>).forEach(([key, value]) => {
      data.append(key, value)
    })
    data.append("docPDF", file);
    await axios.post("http://116.202.198.11/api/add/Card_or_Addition", data)
    .then(() => {
      setCreateCardError(false)
      setShowApproveModal(false)
      cleanInputs()
      setFileName('')
      setFile(null)
    })
    .catch((err) => {
      setCreateCardLog(err.response.data.error)
      setCreateCardError(true)
    })
    GetCards()

  };



  return (
    <>
      <div className='addCardFormHeader'>
         <button onClick={() => setShowApproveModal(false)}>←</button>
         <h1>Перевірка даних</h1>
      </div>
      <div className='approveModalContainer'>
        <div className='sendDataContainer'>

                 <div className='sendData'>
                  <h1>Найменування:</h1>
                  <p>{formData.name}</p>
                 </div>
                 <div className='sendData'>
                  <h1>Автор:</h1>
                  <p>{userName}</p>
                 </div>
                 <div className='sendData'>
                  <h1>Тип документу:</h1>
                  <p>{formData.contractType}</p>
                 </div>
                 <div className='sendData'>
                  <h1>Тип договору:</h1>
                  <p>{formData.docType}</p>
                 </div>
                 <div className='sendData'>
                  <h1>Тип найменування:</h1>
                  <p>{formData.counterpartyName}</p>
                 </div>
                 <div className='sendData'>
                  <h1>Найменування контерагента:</h1>
                  <p>{formData.counterpartyCode}</p>
                 </div>
                 <div className='sendData'>
                  <h1>Дата створення:</h1>
                  <p>{formData.docCreateDate}</p>
                 </div>
                 <div className='sendData'>
                  <h1>Дата підписання:</h1>
                  <p>{formData.docSigningDate}</p>
                 </div>
                 <div className='sendData'>
                  <h1>Срок дії:</h1>
                  <p>{formData.validityPeriod}</p>
                 </div>
                 <div className='sendData'>
                  <h1>Найменування організації:</h1>
                  <p>{formData.organizationName}</p>
                 </div>
                 <div className='sendData'>
                  <h1>Код ЄДРПОУ організації:</h1>
                  <p>{formData.organisationCode}</p>
                 </div>
                 <h1 className='approveModalContentTitle'>Короткий зміст:</h1>
                 <p className='approveModalContent'>{formData.content}</p>

        </div>
          {pdfURL && (
            <iframe className='pdfDocContainer' src={pdfURL} />
          )}
      </div>
      <h1 id='approvedLog'  style={ createCardError ? {color:'red'} : {color:'green'}}>{createCardLog}</h1>
      <div className='addButtons'>
         <button onClick={() => {createCard();  setShowAddition(false); showAddition && setFormData(initialFormData)}}>Додати</button>
      </div>
    </>
  )
}

export default ApproveModal