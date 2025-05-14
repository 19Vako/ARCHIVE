/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react-hooks/exhaustive-deps */

import './styles/addCard.css'

import { useEffect } from 'react'
import { useStore } from '../context/Context';
import { reverseWord, today } from '../utils/Utils';
import FilterCard from './FilterCard';
import CardList from './CardList';
import AddCardForm from './AddCardForm'
import ApproveModal from './ApproveModal';


function AddCard() {
  const { 
    userName,  
    setCards,
    setFormData,
    showFilter, 
    setShowFilter,
    setShowAddition,
    showApproveModal, 
    setPage,
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
  const cleanInputs = () => {
    setFormData(initialFormData)
  }
  const choiceFilter = () => {
    setShowFilter(true); 
    cleanInputs()
    setShowAddition(false)
    setCards([]);
    setPage(1);
    setHasMore(true);
  }

  
  return (
    <div className='addCardContainer'>
      <div className='cardListContainer'>
        <div className='cardListTitle'>
          <h1>Фільтрувати архів</h1>
          <button onClick={() => choiceFilter()}>
            <img src={require('../icons/filter.png')} alt=''/>
          </button>
        </div>
        <CardList/>
      </div>

      {!showFilter ? (
        <div className='addCardForm'>
          {!showApproveModal ? (
            <AddCardForm/>
          ):(
            <ApproveModal/>
          )}
        </div>
      ):(
        <FilterCard/>
      )}
    </div>
  )
}

export default AddCard