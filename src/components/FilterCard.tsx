import React from 'react'
import { useStore } from '../context/Context';
import axios from 'axios';
import './styles/filterCard.css'

function FilterCard() {
  const env = process.env as any;
  const today = new Date().toISOString().split("T")[0];
  const { 
    userName,  
    setCards,
    formData, 
    setFormData,
    setShowFilter,
    setGetCardError,
    filterLog,
    setFilterLog,
    findAuthor, 
    setFindAuthor,
    createCardError, 
    setCreateCardError
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
    addition: [],
    author: userName,
    createDate: reverseWord(today),
  };
  function reverseWord(str: string): string {
    return str
      .split('-')
      .reverse()
      .join('-');
  };
  const GetCards = async () => {
    await axios.get(env.REACT_APP_GET_CARDS)
    .then((data) => {
      setCards(data.data.cards)
    })
    .catch((err) => {
      setGetCardError(err.response.data.error)
    })
  };
  const cleanInputs = () => {
    setFormData(initialFormData)
  }
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
  const filterCard = async () => {
    await axios.post(env.REACT_APP_FIND_CARDS, {
      docType: formData.docType, 
      docNumber:formData.docNumber,
      docCreateDate:formData.docCreateDate,
      docSigningDate:formData.docSigningDate,
      name:formData.name,
      author:findAuthor,
      validityPeriod:formData.validityPeriod,
      organizationName:formData.organizationName,
      organisationCode:formData.organisationCode,
      counterpartyName:formData.counterpartyName,
      counterpartyCode:formData.counterpartyCode,
      contractType:formData.contractType
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

  return (
     <div className='filterContainer'>
            <div className='filterTitle'>
                <button onClick={() => {setShowFilter(false); cleanInputs()}}>←</button>
                <h1>Фільтри</h1>
                <button onClick={() => {cleanInputs(); GetCards(); setFilterLog('')}}><img src={require('../icons/rotation.png')} alt=''/></button>
            </div>
            <div className='filterCardFormInput'>
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
                value={formData.counterpartyName}
                onChange={handleChange}
                placeholder='Найменування контрагенту'
              />
            </div>

                </div>
            </div>
            <div className='addButtons'>
          <button onClick={() => filterCard()}>
            Фільтрувати
          </button>
            </div>
            <h1 style={createCardError ? {color:'red'} : {color:'green'}} className='filterErrorTitle'>{filterLog}</h1>
     </div>
  )
}

export default FilterCard