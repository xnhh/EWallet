import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useSimpleSnackbar} from '../../Components/SimpleSnackbar';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import HowToReg from '@material-ui/icons/HowToReg';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { Link } from "react-router-dom";

const minLength = 12;
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
        width: '100%',
        marginTop: theme.spacing(1),
        textAlign: 'center'
    },
    submit: {
        fontSize: 18,
        width: "60%",
        marginTop: theme.spacing(2)
    },
    import: {
        margin: theme.spacing(2),
        color:"#f44336",
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

function ImportWallet () {
  const classes = useStyles();
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPrivateKey,setIsPrivateKey] = useState(true)
  const [key,setKey] = useState('')
  const showSnackbar = useSimpleSnackbar()

  const changeKeyType = e => {
    e.preventDefault()
    setIsPrivateKey(isPrivate => !isPrivate)
  }
  const updatePassword = e => {
    let _password = e.target.value;
    setPassword(_password);
  };
  const updateConfirmPassword = e => {
    let _confirmPassword = e.target.value;
    setConfirmPassword(_confirmPassword);
  }
  const updateKey = e => {
    setKey(e.target.value);
  };

  const onSubmit = e => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return showSnackbar("前后两次密码不一致", "error");
    }
    if (password.length < minLength) {
      return showSnackbar("密码至少12位", "error");
    }
  }

  return (
    <div className={classes.container}>
      <Avatar className={classes.avatar}>
        <HowToReg />
      </Avatar>
      <Typography className={classes.title}>
        {isPrivateKey ? "请输入你的私钥" : "请输入你的助记词"}
      </Typography>
      <form className={classes.form} onSubmit={onSubmit}>
        <FormControl margin="normal" fullWidth>
          <TextField id="key-password-input"
            label={isPrivateKey ? "私钥" : "助记词"}
            required
            type="password"
            value={key}
            onChange={updateKey} />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <TextField id="standard-password-input"
            label="设置密码"
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={updatePassword} />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <TextField id="confirm-password-input"
            label="请再次输入密码"
            required
            type="password"
            autoComplete="current-password"
            value={confirmPassword}
            onChange={updateConfirmPassword} />
        </FormControl>
        <Button type='submit' variant="contained" color="primary" className={classes.submit}>
          导入
        </Button>
      </form>
      <Link to='/' className={classes.submit}>
        <Button variant="contained" color="primary" className={classes.submit}>
          取消
        </Button>
      </Link>
      <Link to="#" onClick={changeKeyType} className={classes.import}>
        {isPrivateKey ? "从助记词导入" : "从私钥导入"}
      </Link>
    </div>
  );
}

export default ImportWallet;

