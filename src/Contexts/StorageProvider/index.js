import { createContext, useCallback, useContext, useMemo, useEffect, useReducer } from "react";
import { reactLocalStorage } from 'reactjs-localstorage';
import { safeAccess } from "../../Utils";

const appKey = process.env.REACT_APP_APPKEY;

const StorageContext = createContext();

function useStorageContext () {
  return useContext(StorageContext);
}

const UPDATE = 'UPDATE';
const INIT = 'INIT'

function reducer (state, { type, payload }) {
  switch (type) {
    case UPDATE:
      {
        const [address, value] = payload;
        return {
          ...state,
          [address]: value
        };
      }
    case INIT:
      {
        return payload;
      }
    default:
      {
        throw Error(`Unexpected action type in StorageContext reducer: '${type}'.`);
      }
  }
}

export default function Provider ({ children }) { 
  const [state, dispatch] = useReducer(reducer, null);
  const updateByAddress = useCallback((address, value) => {
    reactLocalStorage.setObject(appKey, {
      ...state,
      [address]: value
    });
    dispatch({
      type: UPDATE,
      payload: {address, value}
    });
  }, [state]);

  const initState = useCallback(payload => {
    dispatch({ type: INIT, payload });
  }, []);

  return (
    <StorageContext.Provider value={useMemo(() => [state, { updateByAddress, initState }], [state, updateByAddress, initState])}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage () {
  const [data, { initState }] = useStorageContext();

  useEffect(() => {
    if (!data) {
      let _data = reactLocalStorage.getObject(appKey);
      initState(_data);
    }
  }, [data, initState]);

  return data;
}

// export function useUpdateStorage () {
//   const [, { update }] = useStorageContext();
//   return update;
// }

export function useDefaultAccount () {
  const [data,] = useStorageContext();
  let keys = Object.keys(data);
  return keys[0];
}

export function useAccountCrypt (address) {
  const [data,] = useStorageContext();
  return safeAccess(data, [address, 'crypt']);
}

export function useUpdateCrypt () {
  const [data, { updateByAddress }] = useStorageContext();

  return useCallback((address, crypt) => {
    let _data = safeAccess(data, [address]) || {};
    _data = {
      ..._data,
      crypt
    };
    updateByAddress(address, _data);
  }, [updateByAddress, data]);
}

// export function useBalance (address, network) {
//   const [data,] = useStorageContext();
//   return safeAccess(data, [address, network, 'balance']);
// }

// export function useUpdateBalance () {
//   const [data, { updateByAddress }] = useStorageContext();
//   return useCallback((address, network, balance))
// }