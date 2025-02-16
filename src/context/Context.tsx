import React, { createContext, useContext, useState } from "react";


type ContextType = {
  userName:string,
  setUserName: (name: string) => void                                                             
}


const Context = createContext<ContextType | undefined>(undefined)
export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userName, setUserName] = useState<string>('')

    return (
    <Context.Provider value={{ userName, setUserName }}>
      {children}
    </Context.Provider>
  );
}

export const useStore = (): ContextType => {
   const context = useContext(Context);
  if (!context) {
    throw new Error('useStore must be used within a Provider');
  }
  return context;
}