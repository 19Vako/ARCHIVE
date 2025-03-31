import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useStore } from '../context/Context';
import Header from '../components/Header';
import AddAddition from '../components/AddAddition';
import '../components/styles/addCard.css'
import './styles/manager.css'

function Manager() {
  const today = new Date().toISOString().split("T")[0];
  const {
    userName,  
    cards, 
    setCards,
    showCard, 
    setShowCard,
    setShowCardDataLog,
    showCardDataLog,
    formData, 
    setFormData,
    showSaveChangesButton,
    setShowSaveChangesButton,
    showFilter, 
    setShowFilter,
    fileName, 
    setFileName,
    file, 
    setFile,
    setFilterLog,
    pdfURL, 
    setPdfURL,
    showCardPDF,
    setShowCardPDF,
    getCardError, 
    setGetCardError,
    setAdditions,
    additions,
    setShowAddition,
    showAddition,
    filterLog,
    findAuthor, 
    setFindAuthor,
    filterFormData, 
    setFilterFormData,
    setShowAddAddition,
    showAddAddition,
    setShowAddAdditionData,
    setShowAddAdditionCardPDF,
    setAddAdditionLog,
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
  const [showApproveModal, setShowApproveModal] = useState(false); // Стан модального вікна
  const [createCardLog, setCreateCardLog] = useState(''); // Логування при створення нових карток
  const [createCardError, setCreateCardError] = useState(false); // Зміна кольору логу при створенні картки 
  const [fileLog, setFileLog] = useState(false);

  const GetCards = async () => {
    await axios.post("http://116.202.198.11/api/get/Cards")
    .then((data) => {
      setCards(data.data.cards)
    })
    .catch((err) => {
      setGetCardError(err.response.data.error)
    })
  }
  useEffect(() => {
    GetCards()
  },[]);
  const GetAdditions = async (_id:any) => {
    await axios.post("http://116.202.198.11/api/get/Additions", {docId:_id})
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (["docCreateDate", "docSigningDate", "validityPeriod"].includes(name)) {
          const [year, month, day] = value.split("-");
          setFilterFormData({ ...filterFormData, [name]: `${day}-${month}-${year}` });
        } else {
          setFilterFormData({ ...filterFormData, [name]: value });
        }
  }; 
  const formatDateForInput = (date: string): string => {
    if (!date) return "";
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };
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
  const openApproveModal = () => {
    if(fileName){
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
    setShowFilter(true)
    setShowCard(true); 
    setFormData({...card});
    setShowCardPDF((prev: any) => ({ ...prev, fileName: card.docPDF }))
    setShowCardDataLog('')
    setFile('')
    setFileName('')
    setShowSaveChangesButton(false)
    setShowAddition(false)
    GetAdditions(card._id)
  }
  const choiseListAdditionCard = (card:any) => {
    setShowAddAdditionData({...card})
    setShowAddAdditionCardPDF((prev: any) => ({ ...prev, fileName: card.docPDF }));
    GetAdditions(card._id);
    setShowAddition(false);
    setAddAdditionLog('')
  }
  const filterCard = async () => {
    await axios.post("http://116.202.198.11/api/find/Cards", {
      docType: filterFormData.docType, 
      docNumber:filterFormData.docNumber,
      docCreateDate:filterFormData.docCreateDate,
      docSigningDate:filterFormData.docSigningDate,
      name:filterFormData.name,
      author:findAuthor,
      validityPeriod:filterFormData.validityPeriod,
      organizationName:filterFormData.organizationName,
      organisationCode:filterFormData.organisationCode,
      counterpartyName:filterFormData.counterpartyName,
      counterpartyCode:filterFormData.counterpartyCode,
      contractType:filterFormData.contractType
    })
    .then((res) => {
      console.log(res.data.data)
      setCards(res.data.data)
      setFilterLog('')
      setCreateCardError(false)
    })
    .catch((err) => {
      setCreateCardError(true)
      setFilterLog(err.response.data.error);
  });
  };
  const changeCard = async () => {
    const data = new FormData();
    Object.entries(formData as Record<string, any>).forEach(([key, value]) => {
      data.append(key, value)
    })
    data.append("docPDF", file);
    data.append("docId", formData._id)

    await axios.post("http://116.202.198.11/api/update/Card", data)
    .then((data) => {
      GetCards()
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
    await axios.post("http://116.202.198.11/api/delete/Card", {docId:formData._id})
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
   <>
    <Header/>
    <div className='manaderContainer'>
     <div className='addCardContainer'>
      <div className='cardListContainer'>
        <div className='cardListTitle'>
          <h1>Фільтрувати архів</h1>
          <button onClick={() => choiceFilter()}>
            <img src={require('../icons/filter.png')} alt=''/>
          </button>
        </div>
        <div className='cardList'>
        {cards ? 
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
            {showAddition ? (<h1>Створити додаток</h1>) : (<h1>Додати картку документу</h1>)}
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
          ):(
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
          )}
        </div>
      ):(
       <>
        {showAddAddition ? 
          <div className='cardAdditionListContainer'>
          <div className='filterAdditionTitle'>
            <h1>Виберіть картку посилання</h1>
          </div>
          <div className='cardList'>
          {cards ? 
            cards.slice().reverse().map((card:any, index:any) => (
              <div key={index} onClick={() => {choiseListAdditionCard(card); setShowCard(true)}} className='CardBlockFilter'>
                <div className='cardBlockDateContainer'>
                  <h1>Організація: {card.organizationName}</h1>
                  <h1>Дата створення: {card.docCreateDate}</h1>
                  <h1>Срок дії до: {card.validityPeriod}</h1>
                </div>
              </div>
            ))
          :(<h1>{getCardError}</h1>)}
          </div>
          </div>
          :
          <div className='cardFilterListContainer'>
          <div className='cardList'>
          {cards ? 
            cards.slice().reverse().map((card:any, index:any) => (
              <div key={index} onClick={() => choiseListCard(card)} className='CardBlockFilter'>
                <div className='cardBlockDateContainer'>
                  <h1>Організація: {card.organizationName}</h1>
                  <h1>Дата створення: {card.docCreateDate}</h1>
                  <h1>Срок дії до: {card.validityPeriod}</h1>
                </div>
              </div>
            ))
          :(<h1>{getCardError}</h1>)}
          </div>
          </div>
        }
        <div className='filterContainer'>
        <div className='filterTitle'>
          <button onClick={() => {
            setShowFilter(false); 
            cleanInputs()
            setShowCard(false); 
            setShowCardDataLog(''); 
            setFormData(initialFormData);
            setShowSaveChangesButton(false)
            setShowFilter(false);
            setShowAddAddition(false);
          }}>←</button>
          <h1>Фільтри</h1>
          <button onClick={() => {cleanInputs(); GetCards(); setFilterLog('')}}><img src={require('../icons/rotation.png')} alt=''/></button>
        </div>
        <div className='filterCardFormInput'>
          <div className='inputsContainer'>
            <div className='addInput'>
              <h1>Тип Договору:</h1>
              <select 
                name='docType' 
                value={filterFormData.docType} 
                onChange={handleFileChange}>
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
                value={formatDateForInput(filterFormData.docCreateDate)} 
                onChange={handleFileChange} 
                placeholder='дата створення'
              />
            </div>
            <div className='addInput'>
              <h1>Дата підписання:</h1>
              <input 
                type='date' 
                name='docSigningDate' 
                value={formatDateForInput(filterFormData.docSigningDate)}
                onChange={handleFileChange}  
                placeholder='дата підписання'
              />
            </div>
            <div className='addInput'>
              <h1>Срок дії:</h1>
              <input 
                type='date' 
                name='validityPeriod'
                value={formatDateForInput(filterFormData.validityPeriod)}
                onChange={handleFileChange} 
                placeholder='Срок дії'
              />
            </div>
          </div>
          <div className='inputsContainer'>
            <div className='addInput' style={{height: "3vw"}}>
              <h1>Найменування:</h1>
              <textarea
                name='name'
                value={filterFormData.name}
                onChange={handleFileChange}
                style={{width: "12vw", height: "3vw"}}
                placeholder='Найменування'
              />
            </div>
            <div className='addInput'>
              <h1>Найменування організації:</h1>
              <input 
                name='organizationName'
                value={filterFormData.organizationName}
                onChange={handleFileChange}
                placeholder='Найменування організації'
              />
            </div>
            <div className='addInput'>
              <h1>Код ЄДРПОУ організації:</h1>
              <input
                name='organisationCode'
                value={filterFormData.organisationCode}
                onChange={handleFileChange}
                placeholder='Код ЄДРПОУ організації'
              />
            </div>
            <div className='addInput'>
              <h1>Код ЄДРПОУ контрагента:</h1>
              <input 
                name='counterpartyCode' 
                value={filterFormData.counterpartyCode} 
                onChange={handleFileChange}
                placeholder='Код ЄДРПОУ контрагента'
              />
            </div>
          </div>
          <div className='inputsContainer'>
            <div className='addInput'>
              <h1>Тип Документа:</h1>
              <select 
                name='contractType'
                value={filterFormData.contractType}
                onChange={handleFileChange}
                >
                <option value="">Тип Документа</option>
                <option value="Договір">Договір</option>
                <option value="Наказ">Наказ</option>
              </select>
            </div>
            <div className='addInput'>
              <h1>Автор:</h1>
              <input 
                name="author"
                value={findAuthor}
                onChange={(e) => setFindAuthor(e.target.value)}
                placeholder='Автор'
              />
            </div>
            <div className='addInput'>
              <h1>Найменування контрагенту:</h1>
              <input 
                name='counterpartyName'
                value={filterFormData.counterpartyName}
                onChange={handleFileChange}
                placeholder='Найменування контрагенту'
              />
            </div>
          </div>
        </div>
        <div className='filterButtons'>
          <button onClick={() => filterCard()}>
            Фільтрувати
          </button>
        </div>
        <h1 style={createCardError ? {color:'red'} : {color:'green'}} className='filterErrorTitle'>{filterLog}</h1>
        </div>

        <div className='cardBlockContainer'>
        {formData._id && 
         <div className='cardContainer'>
         {showCard ?
          <>
            {showAddAddition ? 
              <AddAddition/>
            :
            <>
              <div className='cardContainerBlock'>
                <div className='cardDataButtons'>
                  <div className='cardDataButtonsContainer'>
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
                    Створити посилання
                  </button>
                  <button onClick={() => {setShowAddAddition(true); setShowCard(false)}}>
                    Додати посилання
                  </button>
                  <button >Відправити на 1С</button>
                  <h1 className='showFileTitle'>{fileName}</h1>
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
                      ))) 
                    :(<h1>❌ Список посилань пустий</h1>)
                    }
                  </div>
                </div>
                {formData._id && 
                  <> 
                  <div className='cardDataContainerBox' style={showSaveChangesButton ? {height: "31vw"} : {height: "34.3vw"}}>
                  <div className='cardDataContainer'>

                   <div className='cardDataTitle'>
                    <h1>Найменування:</h1>
                    <p>{formData.name}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Автор:</h1>
                    <p>{formData.author}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Тип договору:</h1>
                    <p>{formData.contractType}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Тип документу:</h1>
                    <p>{formData.docType}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Найменування:</h1>
                    <p>{formData.counterpartyName}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Найменування контерагента:</h1>
                    <p>{formData.counterpartyCode}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Дата створення:</h1>
                    <p>{formData.docCreateDate}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Дата підписання:</h1>
                    <p>{formData.docSigningDate}</p>
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
                    <p>{formData.organizationName}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Код ЄДРПОУ організації:</h1>
                    <p>{formData.organisationCode}</p>
                   </div>
    
                   <div className='cardDataTitle'>
                    <h1>Код ЄДРПОУ контрагента:</h1>
                    <p>{formData.counterpartyCode}</p>
                   </div>

                  </div>
                  </div>
                    <button className='saveCangesButton' onClick={() => changeCard()}>Зберегти зміни</button>
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
                src={`${showCardPDF.nameHostAndPort}${showCardPDF.fileName}`}
              /> 
            </> 
            }
          </> : null
         }
         </div>  
        }
        </div>
       </>
      )}
     </div>
    </div>
   </>
  )
}

export default Manager