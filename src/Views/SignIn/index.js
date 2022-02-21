import { useState } from "react";
import { useSimpleSnackbar } from "../../Components/SimpleSnackbar";
import { useStorage } from "../../Contexts/StorageProvider";
import { useUpdateGlobal } from "../../Contexts/GlobalProvider"
import { Avatar, makeStyles } from "@material-ui/core";
import LockIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { aesDecrypt } from "../../Utils";
import { ethers } from 'ethers';
import { withRouter } from "react-router";

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(3)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  wallet: {
    textAlign: "center",
    marginTop: theme.spacing(3),
    fontSize: 20
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
    textAlign: 'center'
  },
  submit: {
    fontSize: 20,
    width: "50%",
    marginTop: theme.spacing(6)
  }
}))

function SignIn ({ history }) {
  const classes = useStyles();
  const showSnackbar = useSimpleSnackbar();
  const [password, setPassword] = useState('');
  const storage = useStorage();
  const updateGlobal = useUpdateGlobal();

  const updatePassword = e => {
    const value = e.target.value;
    setPassword(value);
  }
  
  const onSubmit = e => {
    e.preventDefault();
    if (storage && storage.length > 0) { 
      let _crypt = storage[0].crypt;
      try {
        let privateKey = aesDecrypt(_crypt, password);
        let wallet = new ethers.Wallet(privateKey);
        let options = {
          isLogin: true,
          wallet,
        };
        updateGlobal(options);
        history.push('/detail');
      } catch (err) {
        showSnackbar("密码错误", 'error');
      }
    }
  }

  return (
    <div className={classes.container}>
      <Avatar className={classes.avatar}>
        <LockIcon />
      </Avatar>
      <Typography  color='secondary' className={classes.wallet}>
        KHWallet，简单安全易用的
      </Typography>
      <Typography  color='secondary' className={classes.wallet}>
        以太坊钱包
      </Typography>
      <form className={classes.form} onSubmit={onSubmit}>
        <FormControl margin="normal"  fullWidth>
          <TextField id="standard-password-input"
            label="密码"
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={updatePassword}/>
        </FormControl>
        <Button type='submit' variant="contained" color="primary" className={classes.submit}>
          登录
        </Button>
      </form>

    </div>
  )
}

export default withRouter(SignIn);