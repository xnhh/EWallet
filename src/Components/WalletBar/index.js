import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Logo from '../Logo'
import MenuBtn from '../MenuBtn'

const useStyles = makeStyles(theme => ({
  root: {
      flexGrow: 1
  },
  container: {
      display: 'flex',
      justifyContent: 'space-between'
  }
}));

export default function WalletBar () {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color='default'>
        <Toolbar className={classes.container}>
          <Logo />
          <MenuBtn />
        </Toolbar>
      </AppBar>
    </div>
  );

}
