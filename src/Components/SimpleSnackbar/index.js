import React, { createContext, useContext } from "react";
import { useSnackbar } from "notistack";

const SnackbarContext = createContext();

export function useSimpleSnackbar(){ 
  return useContext(SnackbarContext)
}

const VARIANTS = [
  'default',
  'success',
  'error',
  'warning',
  'info'
]

export default function Provider ({ children }) { 
  const { enqueueSnackbar } = useSnackbar();
  const showSnackbar = (message,variant='default',closeNotification) => {
    // variant could be success, error, warning, info, or default
    if(VARIANTS.indexOf(variant) === -1) {
        variant='default';
    }
    let options = {
        variant
    }
    if(closeNotification) {
        options['onClose'] = closeNotification
    }
    enqueueSnackbar(message, options);
  };
  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
    </SnackbarContext.Provider>
  )
}