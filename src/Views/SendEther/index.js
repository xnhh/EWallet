import React, { useState } from "react";
import { withRouter } from "react-router";
import SendEtherForm from "../SendEtherForm";
import TransactionInfo from "../TransactionInfo";

const BEGIN = 'begin';
const PENDING = 'pending';

const values_init = {
  status: BEGIN,
  tx: null,
  td: null

}

function SendEther ({ history }) {
  const [values, setValues] = useState(values_init);

  const sendOver = tx => {
    setValues({
      status: PENDING,
      tx,
      td: null
    });
  }

  const reverseBack = () => {
    history.push('/detail');
  }

  const { status, tx } = values;
  if (status === BEGIN) {
    return (
      <SendEtherForm cancelCallback={reverseBack} sendCallback={sendOver} />
    );
  } else if (status === PENDING) {
    return (
      <TransactionInfo tx={tx} reverseCallback={reverseBack} />
    );
  } else {
    return null;
  }

}

export default withRouter(SendEther);