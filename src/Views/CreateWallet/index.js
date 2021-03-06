import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/PersonAdd';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {useSimpleSnackbar} from '../../Components/SimpleSnackbar';
import TextField from '@material-ui/core/TextField';
import { ethers } from 'ethers';
import { aesEncrypt } from '../../Utils';
import { useUpdateCrypt } from '../../Contexts/StorageProvider';
import { useUpdateGlobal } from '../../Contexts/GlobalProvider';
import { withRouter } from 'react-router';


const useStyles = makeStyles(theme => ({
  avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
  },
  title: {
      marginTop: theme.spacing(1),
      fontSize: 20
  },
  form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      textAlign: 'center'
  },
  submit: {
      fontSize: 20,
      width: "50%",
      marginTop: theme.spacing(5)
  },
  import: {
      margin: theme.spacing(4),
      color: "#FF5722",
      fontSize: 18,
      textDecoration: "none"
  },
  wallet: {
      textAlign: "center",
      fontSize: 18
  },
  container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: theme.spacing(3)
  }
}));

function CreateWallet ({history}) { 
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const showSnackbar = useSimpleSnackbar();
  const updateCrypt = useUpdateCrypt();
  const updateGlobal = useUpdateGlobal();

  const updatePassword = e => { 
    let _password = e.target.value;
    setPassword(_password);
  }

  const updateConfirmPassword = e => {
    let _confirmPassword = e.target.value;
    setConfirmPassword(_confirmPassword);
  }

  const onSubmit = e => {
    e.preventDefault();
    if (password !== confirmPassword) { 
      return showSnackbar("?????????????????????", "error");
    }
    if (password.length < 12) { 
      return showSnackbar("????????????12???", "error");
    }
    let wallet = null;
    try {
      wallet = ethers.Wallet.createRandom();
    } catch (err) {
      showSnackbar("??????????????????????????????????????????", 'error');
    }
    if (wallet) {
      try {
        let _crypt = aesEncrypt(wallet.privateKey, password);
        updateCrypt(wallet.address, _crypt);
        updateGlobal({
          isLogin: true,
          password,
          wallet
        });
        history.push('/detail');
      } catch (err) {
        console.log(err);
        showSnackbar("??????????????????", err);
      }
    }
  }

  return (
    <div className={classes.container}>
      <Avatar className={classes.avatar}>
        <AddIcon />
      </Avatar>
      <Typography className={classes.title}>
        ????????????????????????
      </Typography>
      <form className={classes.form} onSubmit={onSubmit}>
        <FormControl margin="normal"  fullWidth>
          <TextField id="standard-password-input"
            label="????????????"
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={updatePassword}/>
        </FormControl>
        <FormControl margin="normal"  fullWidth>
          <TextField id="confirm-password-input"
            label="??????????????????"
            required
            type="password"
            autoComplete="current-password"
            value={confirmPassword}
            onChange={updateConfirmPassword}/>
        </FormControl>
        <Button type='submit' variant="contained" color="primary" className={classes.submit}>
          ??????
        </Button>
      </form>
      <Link href="/import" className={classes.import}>??????????????????</Link>
        <div className={classes.wallet}>
            <Typography color='secondary'>
                KHWallet????????????????????????
            </Typography>
            <Typography color='secondary'>
                ???????????????
            </Typography>
        </div>
    </div>
  )
}

export default withRouter(CreateWallet);