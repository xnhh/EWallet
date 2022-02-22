import { createContext, useCallback, useContext, useState, useMemo, useEffect } from "react";
import { reactLocalStorage } from 'reactjs-localstorage';

const appKey = process.env.REACT_APP_APPKEY;

const StorageContext = createContext();

function useStorageContext () {
  return useContext(StorageContext);
}

export default function Provider ({ children }) { 
  const [data, setData] = useState(null);
  const update = useCallback(_data => {
    reactLocalStorage.setObject(appKey, _data);
    setData(_data);
  });

  return (
    <StorageContext.Provider value={useMemo(() => [data, { update }], [data, update])}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage () {
  const [data, { update }] = useStorageContext();

  useEffect(() => {
    if (!data) {
      let _data = reactLocalStorage.getObject(appKey);
      if (!_data.length) {
        update([]);
      } else {
        update(_data);
      }
    }
  }, [data, update]);

  return data;
}

export function useUpdateStorage () {
  const [, { update }] = useStorageContext();
  return update;
}