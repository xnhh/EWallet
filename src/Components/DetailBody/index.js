import { Avatar, Button,  ListItemText,  Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles"
import { useEffect, useState } from "react";
import { useGlobal } from "../../Contexts/GlobalProvider"
import { ethers } from "ethers";
import { convertToEth } from "../../Utils";
import etherIcon from '../../Assets/ether.jpeg'
import { useBalance } from "../../Contexts/BalancesProvider";
import { withRouter } from 'react-router';

const MAINNET = 'homestead';
const INTERVAL = 60000;

const etherscanProvider = new ethers.providers.EtherscanProvider();


const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: "100%"
  },
  avatar: {
    border: 1,
    borderStyle: "solid",
    borderColor: "#33333333",
    marginTop: theme.spacing(3),
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  balanceText: {
    marginTop: theme.spacing(3)
  },
  sendBtn: {
    width: "40%",
    margin:theme.spacing(3)
  }
}));

function DetailBody ({history}) {
  const classes = useStyles();
  const { network, wallet } = useGlobal();
  const { address } = wallet;
  const balance = useBalance(address, network);
  const [ethPrice, setEthPrice] = useState(0);

  useEffect(() => {
    if (network === MAINNET) {
      let stale = false;
      function getPrice () {
        etherscanProvider.getEtherPrice().then(price => {
          if (!stale) {
            setEthPrice(price);
          }
        }).catch(e => {});
      }
      getPrice();
      let interval = setInterval(getPrice, INTERVAL);

      return () => {
        stale = true;
        clearInterval(interval);
      }
    }
  }, [network]);

  const onSend = e => {
    e.preventDefault();
    history.push('/send');
  }

  return (
    <div className={classes.container}>
      <Avatar alt="Ether logo" src={etherIcon} className={classes.avatar} />
      <ListItemText
        className={classes.balanceText}
        primary={
          <Typography variant="h6" align="center" color="textPrimary" >
            {`${convertToEth(balance).toFixed(4)} ETH`}
          </Typography>
        }
        secondary={
          <Typography variant="body1" align="center" color="textSecondary" >
            {network === MAINNET ? `${(convertToEth(balance) * ethPrice).toFixed(2)} USD` : <span>&nbsp;</span>}
          </Typography>
        }
      />
      <Button className={classes.sendBtn} variant="contained" color='primary' onClick={onSend}>
        发送
      </Button>
    </div>
  );
}

export default withRouter(DetailBody);