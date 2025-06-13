import '../screens/styles/manager.css'
import './styles/addCard.css'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useStore } from '../context/Context';
import { reverseWord, today, formatDateForInput } from '../utils/Utils'

function AddCardForm() {                                                     
  const {
    userName,  
    setCards,
    formData, 
    setFormData,
    fileName, 
    setFileName,
    setFile,
    setPdfURL,
    setGetCardError,
    setShowApproveModal,
    showAddition,
    setLoading,
    setHasMore,
    setPage
  } = useStore();
  useEffect(() => {
      if (userName) {
        setFormData((prev: any) => ({
          ...prev,
          author: userName,
          createDate: reverseWord(today)
        }));
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName, setFormData]);
  const [fileLog, setFileLog] = useState(false);
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
  useEffect(() => {
    GetCards()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  const handleFileChoose = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files?.[0];
      const reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPdfURL(reader.result as string); // теперь это будет data:application/pdf;base64,...
      };
      setFileName(file.name);
      setFile(e.target.files[0]);
    }
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
  const openApproveModal = () => {
    if(fileName){
      setShowApproveModal(true)
      setFileLog(false)
    }
    else {
      setFileLog(true)
    }
  }

  
  return (
    <>
      {showAddition ? 
        (<h1>Створити додаток</h1>) : 
        (<h1>Додати картку документу</h1>)
      }
      <div className='addCardFormInput'>

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
              
              <div className='addInput' style={{height: "3vw"}}>
                <h1>Найменування:</h1>
                <textarea
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  style={{width: "12vw", height: "3vw"}}
                  placeholder='Найменування'
                />
              </div>
              <div className='addInput' >
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
                  name='organisationCode'
                  value={formData.organisationCode}
                  onChange={handleChange}
                  placeholder='Код ЄДРПОУ організації'
                />
              </div>
              <div className='addInput'>
                <h1>Код ЄДРПОУ контрагента:</h1>
                <input 
                  name='counterpartyCode' 
                  value={formData.counterpartyCode} 
                  onChange={handleChange}
                  placeholder='Код ЄДРПОУ контрагента'
                />
              </div>
  
              </div>
              
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
                <h1>Особистий номер:</h1>
                <input 
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
  )
}

export default AddCardForm