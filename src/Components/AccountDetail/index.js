import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, TextField } from "@material-ui/core";
import React, {useState} from "react";
import { useGlobal } from "../../Contexts/GlobalProvider";
import { useAddressIcon } from "../../Hooks";
import { makeStyles } from "@material-ui/core/styles"
import { getChainIdByNetwork, getEtherscanLink, nodeToString } from "../../Utils";
import CloseIcon from '@material-ui/icons/Close';
import QRCode from "qrcode-react";
import { useSimpleSnackbar } from "../SimpleSnackbar";
import copy from "copy-to-clipboard";

const ETHEREUM_PREV = 'ethereum:';

const useStyles = makeStyles(theme => ({
  closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(0.5),
      color: theme.palette.grey[500],
  },
  submit: {
      width: "100%"
  },
  icon:{
      marginTop:theme.spacing(-1),
      marginBottom:theme.spacing(-2),
  },
  returnBtn:{
      position: 'absolute',
      left: theme.spacing(1),
      top: theme.spacing(0.5),
      color: theme.palette.grey[500],
  },
  confirmBtn:{
      width:"40%",
  },
  warn:{
      marginTop:theme.spacing(2),
      marginBottom:theme.spacing(2),
      backgroundColor:"#ffebeeee",
      color:"#f44336",
      fontSize:"13px",
  },
  buttonWrap:{
      marginTop:theme.spacing(2),
      marginBottom:theme.spacing(2),
      width:"100%",
      display:"flex",
      flexDirection:"row",
      justifyContent:"space-between"
  },
  buttonWrapTwo:{
      marginTop:theme.spacing(2),
      marginBottom:theme.spacing(2),
      width:"100%",
      textAlign:"center"
  },
  titleTwo:{
      marginTop:theme.spacing(-1),
      marginBottom:theme.spacing(-4),
  }
}));

function AccountDetail ({ closeCallback, open }) {
  const classes = useStyles();
  const { wallet, network, password } = useGlobal();
  const { address } = wallet;
  const icon = useAddressIcon(address);
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [state, setState] = useState({
    status: 'normal',
    type: ''
  });
  const showSnackbar = useSimpleSnackbar();

  const handleCloseDetail = () => {
    returnBack();
    if (closeCallback) {
      closeCallback();
    }
  }

  const returnBack = () => {
    setState({
      status: 'normal',
      type: ''
    });
    setConfirmedPassword('');
  }

  const handleChange = e => {
    setConfirmedPassword(e.target.value);
  }

  const doExport = e => {
    if (password !== confirmedPassword) {
      return showSnackbar("????????????", 'error');
    }
    setState({
      ...state,
      status: 'export'
    });
  }

  const showAccount = () => {
    const { address } = wallet;
    let chainId = getChainIdByNetwork(network)
    let url = getEtherscanLink(chainId, address, 'address')
    window.open(url)
  }

  const exportSomething = (name) => () =>{
    setState({
      status:'validate',
      type:name
    })
  }

  function showCommonPanel () {
    const { status } = state;
    const { address } = wallet;
    return (<>
      <DialogTitle align='center' className={classes.icon}>
        <div dangerouslySetInnerHTML={{__html: nodeToString(icon)}}></div>
      </DialogTitle>
      <DialogTitle id="customized-dialog-title">
        {
          status !== 'normal' &&
            <Button className={classes.returnBtn} onClick={returnBack}>
              {"??????"}
            </Button>
        }
        <div>
          ????????????
        </div>
        <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseDetail}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent align='center'>
        {status === 'normal' && <QRCode size={150} value={ETHEREUM_PREV + address} />}
        <FormControl fullWidth margin="normal" >
          <TextField
            id="outlined-read-only-input"
            name="address"
            value={address}
            variant="outlined"
            InputProps={{
              readOnly: true
            }}
          />
        </FormControl>
      </DialogContent>
      </>
    )
  }

  function showNormalPanel() {
    return (
      <DialogContent align='center'>
        <FormControl fullWidth margin="normal" >
          <Button variant="contained" color="primary" className={classes.submit} onClick={showAccount}>
            ???ETHERSCAN?????????
          </Button>
          </FormControl>
        {wallet.mnemonic &&
          <FormControl fullWidth margin="normal" >
            <Button variant="contained" color="primary" className={classes.submit} onClick={exportSomething('words')}>
              ???????????????
            </Button>
          </FormControl>
        }
        <FormControl fullWidth margin="normal" >
          <Button variant="contained" color="primary" className={classes.submit} onClick={exportSomething('key')}>
            ????????????
          </Button>
        </FormControl>
      </DialogContent>
    )
  }

  function showValidatePanel () {
    const { type } = state;
    const str = type === 'key' ? "??????" : "?????????";
    return (<>
      <DialogTitle align='center' className={classes.titleTwo}>
        ??????{str}
      </DialogTitle>
      <DialogContent align='center'>
        <FormControl margin="normal" fullWidth>
          <DialogContentText align='left'>
            ??????????????????
          </DialogContentText>
          <TextField id="outlined-password"
            required
            autoFocus
            variant="outlined"
            type="password"
            value={confirmedPassword}
            onChange={handleChange}
          />
          <div className={classes.warn}>
            ?????????????????????????????????{str}?????????????????????{str}???????????????????????????????????????????????????
          </div>
          <div className={classes.buttonWrap}>
            <Button className={classes.confirmBtn} variant='outlined' onClick={handleCloseDetail}>
              ??????
            </Button>
            <Button className={classes.confirmBtn} color='primary' variant='outlined' disabled={!confirmedPassword} onClick={doExport}>
              ??????
            </Button>
          </div>
        </FormControl>
      </DialogContent>
    </>)
  }

  const doCopy = event => {
    const { type } = state;
    event.preventDefault();
    const key = type === 'key' ? wallet.privateKey : wallet.mnemonic
    const str = type==='key' ? "??????" : "?????????"
    if(copy(key))
      showSnackbar(str + "????????????????????????",'success')
  }

  function showExportResultPanel() {
    const { type } = state;
    const str = type==='key' ? "??????" : "?????????"
    return (<>
      <DialogTitle align='center' className={classes.titleTwo}>
        ??????{ str }
      </DialogTitle>
      <DialogContent align='center'>
        <FormControl margin="normal" fullWidth>
          <DialogContentText align='left'>
            {"????????????" + str + "(????????????)"}
          </DialogContentText>
          <TextField
            onClick={doCopy}
            error
            id="outlined-export"
            defaultValue={state.type==='key' ? wallet.privateKey : wallet.mnemonic}
            variant="outlined"
            InputProps={{
                readOnly: true
            }}
          />
          </FormControl>
            <div className={classes.warn}>
              ?????????????????????????????????{str}?????????????????????{str}???????????????????????????????????????????????????
            </div>
            <div className={classes.buttonWrapTwo}>
              <Button className={classes.confirmBtn} color='primary' variant='outlined' onClick={handleCloseDetail}>
                ??????
              </Button>
            </div>
        </DialogContent>
    </>)
  }

  const { status } = state;

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
      onClose={handleCloseDetail}
      aria-labelledby="account-dialog-title"
      aria-describedby="account-dialog-description"
    >
      {showCommonPanel()}
      {status === 'normal' && showNormalPanel()}
      {status === 'validate' && showValidatePanel()}
      {status === 'export' && showExportResultPanel()}
    </Dialog>
  );

}

export default AccountDetail;