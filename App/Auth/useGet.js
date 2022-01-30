import React from 'react';
import axios from 'axios';

import {UserContext} from '../contexts/UserContext';
import { base_url } from '../Utils/constants';

export function useGet(endpoint, initialValue = []) {
  const {token} = React.useContext(UserContext);
  const [data, setData] = React.useState(initialValue);
  React.useEffect(() => {
    axios
      .get(`${base_url }${endpoint}`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
      .then(({data}) => {
        setData(data);
      });
  }, [token, endpoint]);
  return data;
}
