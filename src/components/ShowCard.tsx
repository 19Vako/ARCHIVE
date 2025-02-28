/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { useStore } from '../context/Context';
import axios from 'axios';

function ShowCard() {
  const env = process.env as any;
  const today = new Date().toISOString().split("T")[0];
  function reverseWord(str: string): string {
    return str
      .split('-')
      .reverse()
      .join('-');
  };

  const { 
     setCards,
     setShowCard, 
     showCardDataLog, 
     setShowCardDataLog,
     formData, 
     setFormData,
     userName,
     showSaveChangesButton, 
     setShowSaveChangesButton,
     setShowFilter,
     fileName, 
     setFileName,
     file,
     setFile,
     setPdfURL,
     showCardPDF, 
     setShowCardPDF,
     setGetCardError,
     additions,
     setAdditions,
     setShowAddition,
  } = useStore()
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
  const initialAddition = {
    _id: "",
    docId: formData._id,
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
    addition: [],
    author: userName,
    createDate: reverseWord(today),
  }
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
  const choiseListCard = (card:any) => {
    setShowCard(true); 
    setFormData({...card});
    setShowCardPDF((prev: any) => ({ ...prev, fileName: card.docPDF }))
    setShowCardDataLog('')
    setFile('')
    setFileName('')
    setShowSaveChangesButton(false)
    GetAdditions(card._id)
  }
  const changeCard = async () => {
    const data = new FormData();
    Object.entries(formData as Record<string, any>).forEach(([key, value]) => {
      data.append(key, value)
    })
    data.append("docPDF", file);
    data.append("docId", formData._id)

    await axios.post(env.REACT_APP_UPDATE_CARD, data)
    .then((data) => {
      choiseListCard(data.data.data)
      setShowCardDataLog(data.data.message)
    })
    .catch((err) => {
      setShowCardDataLog(err.response.data.error)
      console.log(err)
    })
  }
  const handleChangeCard = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setShowSaveChangesButton(true)
  }
  const deleteCard = async () => {
    await axios.post(env.REACT_APP_DELETE_CARD, {docId:formData._id})
    .then((data) => {
      setShowCardDataLog(data.data.message)
      GetCards()
      setFormData(initialFormData)
    })
    .catch((err) => {
      setShowCardDataLog(err.response.data.error)
    })
  }

  return (
    <div className='cardContainer'>
            <div className='cardContainerBlock'>
              <div className='cardDataButtons'>
                <div className='cardDataButtonsContainer'>
                  <div className='backButton'>
                    <button onClick={() => {
                      setShowCard(false); 
                      setShowCardDataLog(''); 
                      setFormData(initialFormData);
                      setShowSaveChangesButton(false)
                      setShowFilter(false)
                    }}>←</button>
                  </div>
                  <button 
                    onClick={() => {
                      setShowCard(false); 
                      setShowCardDataLog(''); 
                      setFormData(initialAddition);
                      setShowSaveChangesButton(false)
                      setShowFilter(false)
                      setShowAddition(true)
                    }}
                    >
                    Додати посилання
                  </button>
                  <button >Відправити на 1С</button>
                  <input id="pdfUpload" type="file" accept="application/pdf" onChange={handleFileChoose} style={{ display: "none" }} />
                  <label htmlFor="pdfUpload" onClick={() => setShowSaveChangesButton(true)} className="changeFileButton">
                    Замінити файл
                  </label>
                  <h1 className='showFileTitle'>{fileName}</h1>
                  <button className='saveCangesButton' onClick={() => changeCard()}>Зберегти зміни</button>
                  <button className='deleteCard' onClick={() => deleteCard()} >Видалити</button>
                  <h1>{showCardDataLog}</h1>
                </div>
                <div className='additionList'>
                 {additions ? (
                   additions.slice().reverse().map((card:any, index:any) => (
                    <div key={index} onClick={() => choiseListCard(card)} className='additionBlockContainer'>
                      <h1>Організація: {card.organizationName}</h1>
                      <h1>Дата створення: {card.docCreateDate}</h1>
                      <h1>Срок дії до: {card.validityPeriod}</h1>
                    </div>
                   ))
                  ):(
                    <h1>❌ Список посилань пустий</h1>
                  )
                 }
                </div>
              </div>
              {formData._id && 
              <>
              <div className='cardDataContainer'>
               <div className='cardDataTitle'>
                <h1>Найменування:</h1>
                <input 
                  type="text" 
                  name='name'
                  value={formData.name}
                  onChange={handleChangeCard}
                />
               </div>

               <div className='cardDataTitle'>
                <h1>Автор:</h1>
                <input 
                  type="text" 
                  name='author'
                  value={formData.author} 
                  onChange={handleChangeCard}
                />
               </div>

               <div className='cardDataTitle'>
                <h1>Тип договору:</h1>
                <select 
                  onChange={handleChangeCard}>
                  <option value="">{formData.contractType}</option>
                  <option value="Продаж">Продаж</option>
                  <option value="Замовлення">Замовлення</option>
                  <option value="Надання послуг">Надання послуг</option>
                  <option value="Отримання послуг">Отримання послуг</option>
                </select>
               </div>

               <div className='cardDataTitle'>
                <h1>Тип документу:</h1>
                <select 
                  onChange={handleChangeCard}>
                  <option value="">{formData.docType}</option>
                  <option value="Договір">Договір</option>
                  <option value="Наказ">Наказ</option>
                </select>
               </div>

               <div className='cardDataTitle'>
                <h1>Найменування:</h1>
                <input 
                  type='text'
                  name='counterpartyName'
                  value={formData.counterpartyName} 
                  onChange={handleChangeCard}
                />
               </div>

               <div className='cardDataTitle'>
                <h1>Найменування контерагента:</h1>
                <input 
                  type='text'
                  name='counterpartyCode'
                  value={formData.counterpartyCode} 
                  onChange={handleChangeCard}
                />
               </div>

               <div className='cardDataTitle'>
                <h1>Дата створення:</h1>
                <input 
                  type='text' 
                  name='docCreateDate' 
                  value={formData.docCreateDate} 
                  onChange={handleChangeCard}
                />
               </div>

               <div className='cardDataTitle'>
                <h1>Дата підписання:</h1>
                <input 
                  type='text' 
                  name='docSigningDate' 
                  value={formData.docSigningDate} 
                  onChange={handleChangeCard}
                />
               </div>

               <div className='cardDataTitle'>
                <h1>Срок дії до:</h1>
                <input 
                  type='text'
                  name='validityPeriod' 
                  value={formData.validityPeriod} 
                  onChange={handleChangeCard}
                />
               </div>

               <div className='cardDataTitle'>
                <h1>Найменування організації:</h1>
                <input 
                  type='text'
                  name='organizationName' 
                  value={formData.organizationName} 
                  onChange={handleChangeCard}
                />
               </div>

               <div className='cardDataTitle'>
                <h1>Код ЄДРПОУ організації:</h1>
                <input 
                  type='text'
                  name='organisationCode' 
                  value={formData.organisationCode} 
                  onChange={handleChangeCard}
                />
               </div>
               <div className='cardDataTitle'>
                <h1>Код ЄДРПОУ контрагента:</h1>
                <input 
                  type='text'
                  name='counterpartyCode' 
                  value={formData.counterpartyCode} 
                  onChange={handleChangeCard}
                />
               </div>
              </div>
              <iframe 
                className='cardPdfDocContainer' 
                title='Doc' 
                src={`${showCardPDF.nameHostAndPort}${showCardPDF.fileName}`}
                style={showSaveChangesButton ? {height: "31vw"} : {height: "34.1vw"} }
              />
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
    </div>
  )
}

export default ShowCard