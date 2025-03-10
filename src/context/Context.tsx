import React, { createContext, useContext, useState, useEffect } from "react";

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

const today = new Date().toISOString().split("T")[0];
function reverseWord(str: string): string {
    return str
      .split('-')
      .reverse()
      .join('-');
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

  formData: any
  setFormData: (data:any) => void;

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
  setShowCardPDF: (date:any) => void;

  getCardError: any;
  setGetCardError: (date:any) => void;

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
};

const Context = createContext<ContextType | undefined>(undefined);

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [log_in, setLog_in] = useState(false);
    const [userName, setUserName] = useState<string>(() => {return localStorage.getItem("userName") || "";});
    const [cards, setCards] = useState<CardType[]>([]);
    const [showCard, setShowCard] = useState(false);
    const [showCardDataLog, setShowCardDataLog] = useState('');
    const [showSaveChangesButton, setShowSaveChangesButton] = useState(false)
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
    const [additions, setAdditions] = useState<any[]>([]) 
    const [showAddition, setShowAddition] = useState(false)
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
          setShowAddition
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
