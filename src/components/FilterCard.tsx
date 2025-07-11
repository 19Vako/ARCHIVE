/* eslint-disable react-hooks/exhaustive-deps */
import './styles/filterCard.css'

import React from 'react'
import { useStore } from '../context/Context';
import axios from 'axios';
import ShowCard from './ShowCard';
import CardList from './CardList';
import AdditionCardList from './AdditionCardList';
import { today, reverseWord, formatDateForInput } from '../utils/Utils'

function FilterCard() {
  const { 
    setLoading,
    setHasMore,
    setPage,
    userName,
    formData,
    setCards,
    setFormData,
    setShowFilter,
    setGetCardError,
    filterLog,
    setFilterLog,
    findAuthor, 
    setFindAuthor,
    createCardError, 
    setCreateCardError,
    showCard, 
    setShowCard,
    setShowCardDataLog,
    setShowSaveChangesButton,
    filterFormData, 
    setFilterFormData,
    showAddAddition,
    setShowAddAddition,
  } = useStore();  
  const GetCards = async () => {

    setLoading(true);
    setGetCardError(null); // обнуляем возможную старую ошибку

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
    addition: [],
    author: userName,
    createDate: reverseWord(today),
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (["docCreateDate", "docSigningDate", "validityPeriod"].includes(name)) {
        const [year, month, day] = value.split("-");
        setFilterFormData({ ...filterFormData, [name]: `${day}-${month}-${year}` });
      } else {
        setFilterFormData({ ...filterFormData, [name]: value });
      }
  }; 
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
      setCards(res.data.data)
      setFilterLog('')
      setCreateCardError(false)
    })
    .catch((err) => {
      setCreateCardError(true)
      setFilterLog(err.response.data.error);
  });
  };

  return (
    <>
    {showAddAddition ? 
      <div className='cardAdditionListContainer'>
        <div className='filterAdditionTitle'>
          <h1>Виберіть картку посилання</h1>
        </div>
        <AdditionCardList/>
      </div>
    :
      <div className='cardFilterListContainer'>
        <CardList/>
      </div>
    }
    <div className='filterContainer'>
        <div className='filterTitle'>
          <button onClick={() => {
            setShowFilter(false); 
            setShowCard(false); 
            setShowCardDataLog(''); 
            setFormData(initialFormData);
            setFilterFormData(initialFormData)
            setShowSaveChangesButton(false);
            setShowFilter(false);
            setShowAddAddition(false);
          }}>←</button>
          <h1>Фільтри</h1>
          <button onClick={() => {setFilterFormData(initialFormData); GetCards(); setFilterLog('')}}><img src={require('../icons/rotation.png')} alt=''/></button>
        </div>
        <div className='filterCardFormInput'>
          <div className='inputsContainer'>
            <div className='addInput'>
              <h1>Тип Договору:</h1>
              <select 
                name='docType' 
                value={filterFormData.docType} 
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
                value={formatDateForInput(filterFormData.docCreateDate)} 
                onChange={handleChange} 
                placeholder='дата створення'
              />
            </div>
            <div className='addInput'>
              <h1>Дата підписання:</h1>
              <input 
                type='date' 
                name='docSigningDate' 
                value={formatDateForInput(filterFormData.docSigningDate)}
                onChange={handleChange}  
                placeholder='дата підписання'
              />
            </div>
            <div className='addInput'>
              <h1>Срок дії:</h1>
              <input 
                type='date' 
                name='validityPeriod'
                value={formatDateForInput(filterFormData.validityPeriod)}
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
                value={filterFormData.name}
                onChange={handleChange}
                style={{width: "12vw", height: "3vw"}}
                placeholder='Найменування'
              />
            </div>
            <div className='addInput'>
              <h1>Найменування організації:</h1>
              <input 
                  name='organizationName'
                  value={filterFormData.organizationName}
                  onChange={handleChange}
                  placeholder='Найменування організації'
                />
            </div>
          
            <div className='addInput'>
              <h1>Код ЄДРПОУ організації:</h1>
              <input
                name='organisationCode'
                value={filterFormData.organisationCode}
                onChange={handleChange}
                placeholder='Код ЄДРПОУ організації'
              />
            </div>
            <div className='addInput'>
              <h1>Код ЄДРПОУ контрагента:</h1>
              <input 
                name='counterpartyCode' 
                value={filterFormData.counterpartyCode} 
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
                value={filterFormData.contractType}
                onChange={handleChange}
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
                onChange={handleChange}
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
       {showCard &&
        <ShowCard/>
       }
      </div>
     }
     </div>
    </>
  )
}

export default FilterCard