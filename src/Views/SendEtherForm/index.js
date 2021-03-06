import React, {useState} from "react";
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, FormControl, makeStyles, TextField, Typography } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { useBalance } from "../../Contexts/BalancesProvider";
import { convertToEth, isAddress, getNetworkName, shortenAddress } from "../../Utils";
import { InputAdornment } from "@material-ui/core";
import { useSimpleSnackbar } from "../../Components/SimpleSnackbar";
import { useGlobal } from "../../Contexts/GlobalProvider";
import { utils } from "ethers";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: theme.spacing(2),
  },
  submit: {
      fontSize: 18,
      width: "40%",
      marginTop: theme.spacing(3),
      "&:disabled":{
          color:"white",
          background:blue[200]
      },
  },
  form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      textAlign: 'center'
  },
  dialogBtn:{
      width:"30%",
      margin:theme.spacing(2),
  }
}));

const values_init = {
  recipient: '',
  amount: '',
  gasPrice:6
};

const GAS_LIMIT = 23000;
let params = [0, 0, 0, 0];

function SendEtherForm ({ cancelCallback, sendCallback }) {
  const { wallet, network, provider } = useGlobal();
  const { address } = wallet;
  const classes = useStyles();
  const SYMBOL = "ETH";
  const balance = useBalance(address, network);
  const [values, setValues] = useState(values_init);
  const showSnackbar = useSimpleSnackbar();
  const [open, setOpen] = useState(false);
  const [circleOpen, setCircleOpen] = useState(false);
  
  const { recipient, amount, gasPrice } = values;

  const handleChange = name => e => {
    setValues({
      ...values,
      [name]: e.target.value
    });
  };

  const handleClose = () => {
    setOpen(false);
  }

  const cancelSend = e => {
    e.preventDefault();
    if (cancelCallback) {
      cancelCallback();
    }
  }

  const checkSubmit = e => {
    e.preventDefault();
    const { recipient, amount, gasPrice } = values;
    let _address = isAddress(recipient);
    if (!_address) {
      return showSnackbar("???????????????", 'error');
    }
    if (_address === isAddress(address)) {
      return showSnackbar("?????????????????????ETH????????????", 'error');
    }
    let eth_amount = + amount;
    if (Number.isNaN(eth_amount)) {
      return showSnackbar("???????????????", 'error');
    }
    let _balance = convertToEth(balance);
    if (eth_amount >= _balance) {
      return showSnackbar(`${SYMBOL}????????????`, 'error');
    }
    let gas_price = + gasPrice;
    if(Number.isNaN(gas_price)) {
      return showSnackbar("?????????gas??????",'error')
    }
    params = [_address, eth_amount, gas_price, network];
    setOpen(true);
  }

  const doSubmit = async () => {
    setOpen(false);
    setCircleOpen(true);
    const [_address, eth_amount, gas_price, network] = params;
    const transaction = {
      to: _address,
      value: utils.parseEther("" + eth_amount),
      gasLimit: GAS_LIMIT,
      gasPrice: utils.parseUnits("" + gas_price, 'gwei')
      // chainId: utils.getNetwork(network).chainId
    }
    const tx_wallet = wallet.connect(provider);
    tx_wallet.sendTransaction(transaction).then(tx => {
      setCircleOpen(false);
      if (sendCallback) {
        sendCallback(tx, eth_amount, SYMBOL);
      }
    }).catch(err => {
      console.log(err);
      setCircleOpen(false);
      return showSnackbar(SYMBOL + "????????????", 'error');
    })
  }

  return (
    <div className={classes.container}>
      <Typography variant="h6" align="center" color="textPrimary">
        {`??????${SYMBOL}`}
      </Typography>
      <form className={classes.form} onSubmit={checkSubmit}>
        <FormControl margin="normal" fullWidth>
          <TextField
            id="outlined-ether-balance"
            label={`??????${SYMBOL}??????`}
            variant="outlined"
            type="text"
            value={convertToEth(balance).toFixed(4)}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  {SYMBOL}
                </InputAdornment>
              )
            }}
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <TextField
            id="outlined-ether-recipient"
            label='????????????'
            required
            variant="outlined"
            type="text"
            value={recipient}
            onChange={handleChange('recipient')}
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <TextField
            id="outlined-ether-amount"
            label='????????????'
            required
            variant="outlined"
            type="text"
            value={amount}
            onChange={handleChange('amount')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {SYMBOL}
                </InputAdornment>
              )
            }}
          />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <TextField
            id="outlined-gas-price"
            label='gas??????'
            required
            variant="outlined"
            type="number"
            value={gasPrice}
            onChange={handleChange('gasPrice')}
            InputProps={{
              endAdornment:(
                  <InputAdornment position="end">
                      Gwei
                  </InputAdornment>
               )
            }}
          />
        </FormControl>
        <Button type="submit" variant="contained" color="primary" className={classes.submit}>
          ??????
        </Button>
      </form>
      <Button variant="contained" color="primary" onClick={cancelSend} className={classes.submit}>
        ??????
      </Button>
      <Dialog
        fullWidth
        maxWidth='xs'
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          align='center'
          id="alert-dialog-title"
        >
          {`??????${SYMBOL}??????`}
        </DialogTitle>
        <DialogContent align='left'>
          <DialogContentText id="alert-dialog-description1">
            {"????????????: " + (params[3] ? getNetworkName(params[3]) : '')}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description2">
            {"????????????: " + (params[0] ? shortenAddress(params[0],8) : "")}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description3">
            {"????????????: " + params[1] + " " + SYMBOL}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description4">
            {"Gas??????: " + params[2] + " Gwei"}
          </DialogContentText>
        </DialogContent>
        <DialogContent align='center'>
          <Button onClick={handleClose} variant="outlined" color="inherit" className={classes.dialogBtn}>
            ??????
          </Button>
          <Button onClick={doSubmit} variant="outlined" color="primary" autoFocus className={classes.dialogBtn}>
            ??????
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog
          fullWidth
          maxWidth='xs'
          open={circleOpen}
          aria-labelledby="alert-dialog-title-circle"
          aria-describedby="alert-dialog-description-circle"
      >
          <DialogContent align='center'>
              <div>
                  &nbsp;
              </div>
              <CircularProgress />
              <div>
                  &nbsp;
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}

export default SendEtherForm;