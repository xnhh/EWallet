import React from 'react';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import WalletIcon from '../../Assets/wallet.png';

const useStyles = makeStyles(theme => ({
  icon: {
    width: 50,
    height: 50
  },
  grow: {
    marginTop: theme.spacing(-0.5),
    fontSize: 15
  }
}));

export default function Logo () { 
  const classes = useStyles();

  return (
    <div>
      <img src={WalletIcon} alt='KHWallet' className={classes.icon} />
      <Typography className={classes.grow}>
        KHWallet
      </Typography>
    </div>
  )
}
