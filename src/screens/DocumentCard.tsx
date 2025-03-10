import React, { useEffect } from 'react'
import './styles/documentCard.css'
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { useStore } from '../context/Context';
import Header from '../components/Header';

function DocumentCard() {
  const { id } = useParams()
  const {
    setShowCardDataLog,
    formData, 
    setFormData,
    setShowSaveChangesButton,
    setFileName,
    setFile,
    showCardPDF,
    setShowCardPDF,
    setAdditions,
    additions,
    setShowAddition,
  } = useStore();

  const GetCard = async () => {
    await axios.post("http://116.202.198.11/api/find/Card", {id:id})
    .then((data) => {
      setFormData({...data.data.data});
      setShowCardPDF((prev: any) => ({ ...prev, fileName: data.data.data.docPDF }))
      setShowCardDataLog('')
      setFile('')
      setFileName('')
      setShowSaveChangesButton(false)
      setShowAddition(false)
      GetAdditions(data.data.data._id) 
    })
  }
  const GetAdditions = async (_id:any) => {
    await axios.post("http://116.202.198.11/api/get/Additions", {docId:_id})
    .then((data) => {
      setAdditions(data.data.data)
    })
    .catch((err) => {
      console.log(err.response.data.error)
    })
  }
  useEffect(() => {
    GetCard()
  },[id])

  return (
    <>
    <Header/>
    <div className='documentCardContainer'>
      <div className='cardContainerBlock'>
        <div className='cardDataButtons'>   
          <div className='additionList'>
                 {additions ? (
                   additions.slice().reverse().map((card:any, index:any) => (
                    <Link key={index} to={card.cardLink} className='additionBlockContainer'>
                      <h1>Організація: {card.organizationName}</h1>
                      <h1>Дата створення: {card.docCreateDate}</h1>
                      <h1>Срок дії до: {card.validityPeriod}</h1>
                    </Link>
                   ))
                  ):(
                    <h1>❌ Список посилань пустий</h1>
                  )
                 }
          </div>
        </div>
        <div className='DocumentCardDataContainer'>
           <div className='cardDataTitle'>
            <h1>Найменування:</h1>
            <h1>{formData.name}</h1>
           </div>
           <div className='cardDataTitle'>
            <h1>Автор:</h1>
            <h1>{formData.author}</h1>
           </div>

           <div className='cardDataTitle'>
            <h1>Тип договору:</h1>
            <h1>{formData.contractType}</h1>
           </div>

           <div className='cardDataTitle'>
            <h1>Тип документу:</h1>
            <h1>{formData.docType}</h1>
           </div>

           <div className='cardDataTitle'>
            <h1>Найменування:</h1>
            <h1>{formData.counterpartyName}</h1>
           </div>

           <div className='cardDataTitle'>
            <h1>Найменування контерагента:</h1>
            <h1>{formData.counterpartyCode}</h1>
           </div>

           <div className='cardDataTitle'>
            <h1>Дата створення:</h1>
            <h1>{formData.docCreateDate}</h1>
           </div>

           <div className='cardDataTitle'>
            <h1>Дата підписання:</h1>
            <h1>{formData.docSigningDate}</h1>
           </div>

           <div className='cardDataTitle'>
            <h1>Срок дії до:</h1>
            <h1>{formData.validityPeriod} </h1>
           </div>

           <div className='cardDataTitle'>
            <h1>Найменування організації:</h1>
            <h1>{formData.organizationName}</h1>
           </div>

           <div className='cardDataTitle'>
            <h1>Код ЄДРПОУ організації:</h1>
            <h1>{formData.organisationCode}</h1>
           </div>

           <div className='cardDataTitle'>
            <h1>Код ЄДРПОУ контрагента:</h1>
            <h1>{formData.counterpartyCode}</h1>
           </div>

         </div>
         <iframe 
          className='cardPdfDocContainer' 
          title='Document Preview' 
          src={`${showCardPDF.nameHostAndPort}${showCardPDF.fileName}`}
          style={{ height: "34.1vw"}}
         />


        </div>
            <div className='cardDataTitleContent'>
          <h1>Короткий зміст:</h1>
          <h1 className='contentTitle'>{formData.content}</h1>
        </div>
    </div>
    </>
  )
}

export default DocumentCard