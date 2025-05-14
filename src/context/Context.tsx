/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from "react";
import { reverseWord, today } from "../utils/Utils";

type CardType = {
  _id: string;
  docType: string;
  docNumber: string;
  docPDF: string;
  docCreateDate: string;
  docSigningDate: string;
  name: string;
  validityPeriod: string;
  organizationName: string;
  organisationCode: string;
  counterpartyName: string;
  counterpartyCode: string;
  content: string;
  contractType: string;
  addition: any[];
  author: string;
  createDate: string;
  cardLink: string;
};

type ContextType = {

  log_in: boolean;
  setLog_in: (state: boolean) => void;

  userName: string;
  setUserName: (name: string) => void;
  
  cards: CardType[]; 
  setCards: (cards: CardType[]) => void;

  showCard: boolean;
  setShowCard: (state:boolean) => void;

  showCardDataLog: string;
  setShowCardDataLog: (log:string) => void;

  formData: any;
  setFormData: (data:any) => void;

  filterFormData: any;
  setFilterFormData: (data:any) => void;

  showSaveChangesButton: boolean;
  setShowSaveChangesButton: (stateCard:boolean) => void;

  showFilter: boolean;
  setShowFilter: (state:boolean) => void;

  fileName: string;
  setFileName: (state:string) => void;

  file:any;
  setFile: (state:any) => void;

  pdfURL:any;
  setPdfURL: (state:any) => void;

  showCardPDF: any;
  setShowCardPDF: (data:any) => void;

  getCardError: any;
  setGetCardError: (data:any) => void;

  fileLog: boolean;
  setFileLog: (state:boolean) => void;

  filterLog: string;
  setFilterLog: (data:string) => void;

  findAuthor: string;
  setFindAuthor: (data:string) => void;

  createCardError: boolean;
  setCreateCardError: (state:boolean) => void;

  additions: Array<any>; 
  setAdditions: (additions: Array<any>) => void;

  showAddition: boolean;
  setShowAddition: (state: boolean) => void;

  showAddAddition: boolean;
  setShowAddAddition: (state: boolean) => void;

  showAddAdditionData: any;
  setShowAddAdditionData: (data:any) => void;

  showAddAdditionCardPDF: any;
  setShowAddAdditionCardPDF: (data:any) => void;

  addAdditionLog: string;
  setAddAdditionLog: (data:string) => void;

  showApproveModal: boolean; 
  setShowApproveModal: (state: boolean) => void;

  page: any;
  setPage: (data: any) => void;

  loading: boolean;
  setLoading: (state: boolean) => void;

  hasMore: boolean;
  setHasMore: (state: boolean) => void;

};
const Context = createContext<ContextType | undefined>(undefined);

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [log_in, setLog_in] = useState(false);
    const [userName, setUserName] = useState<string>(() => {return localStorage.getItem("userName") || "";});
    const [cards, setCards] = useState<CardType[]>([]);
    const [showCard, setShowCard] = useState(false);
    const [showCardDataLog, setShowCardDataLog] = useState('');
    const [showSaveChangesButton, setShowSaveChangesButton] = useState(false);
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
    const [formData, setFormData] = useState(initialFormData); // Форма для відправки 
    useEffect(() => {
      if (userName) {
        setFormData((prev: any) => ({
          ...prev,
          createDate: reverseWord(today)
        }));
      }
    }, [userName, setFormData]);
    const [filterFormData, setFilterFormData] = useState(initialFormData);
    const [showFilter, setShowFilter] = useState(false);
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState<File | string>(String);
    const [pdfURL, setPdfURL] = useState<string | null>(null);
    const [showCardPDF, setShowCardPDF] = useState({nameHostAndPort:"http://116.202.198.11/api/pdf-files/", fileName:""});
    const [getCardError, setGetCardError] = useState(''); // Логування помилок отриманні помилок
    const [fileLog, setFileLog] = useState(false);
    const [filterLog, setFilterLog] = useState('');  // Логування помилок при фільтрації
    const [findAuthor, setFindAuthor] = useState('');
    const [createCardError, setCreateCardError] = useState(false); // Зміна кольору логу при створенні картки
    const [additions, setAdditions] = useState<any[]>([]);
    const [showAddition, setShowAddition] = useState(false);
    const [showAddAddition, setShowAddAddition] = useState(false);
    const [showAddAdditionData, setShowAddAdditionData] = useState(initialFormData);
    const [showAddAdditionCardPDF, setShowAddAdditionCardPDF] = useState({nameHostAndPort:"http://116.202.198.11/api/pdf-files/", fileName:""});
    const [addAdditionLog, setAddAdditionLog] = useState('')
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
      localStorage.setItem("userName", userName);
    }, [userName]);
    useEffect(() => {
      localStorage.setItem("cards", JSON.stringify(cards));
    }, [cards]);


    return (
        <Context.Provider 
        value={{
          log_in,
          setLog_in,
          userName, 
          setUserName, 
          cards, 
          setCards,
          showCard, 
          setShowCard,
          showCardDataLog, 
          setShowCardDataLog,
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
          pdfURL, 
          setPdfURL,
          showCardPDF, 
          setShowCardPDF,
          getCardError, 
          setGetCardError,
          fileLog, 
          setFileLog,
          filterLog,
          setFilterLog,
          findAuthor, 
          setFindAuthor,
          createCardError, 
          setCreateCardError,
          additions, 
          setAdditions,
          showAddition, 
          setShowAddition,
          filterFormData, 
          setFilterFormData,
          showAddAddition, 
          setShowAddAddition,
          showAddAdditionData, 
          setShowAddAdditionData,
          showAddAdditionCardPDF, 
          setShowAddAdditionCardPDF,
          addAdditionLog, 
          setAddAdditionLog,
          showApproveModal, 
          setShowApproveModal,
          page, 
          setPage,
          loading, 
          setLoading,
          hasMore, 
          setHasMore
        }}>
          {children}
        </Context.Provider>
    );
};

export const useStore = (): ContextType => {
    const context = useContext(Context);
    if (!context) {
      throw new Error('useStore must be used within a Provider');
    }
    return context;
};
