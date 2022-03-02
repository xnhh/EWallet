import React, { useEffect, useState } from "react";
import { Button, CircularProgress, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import {red,green,blue } from '@material-ui/core/colors';
import { getNetwordByChainId, shortenAddress, getEtherscanLink } from "../../Utils";
import { utils } from "ethers";
import { CheckCircleOutline, ErrorOutline } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  container: {
      display: 'flex',
      flexDirection: 'column',
      margin: theme.spacing(2),
  },
  submit: {
      fontSize: 18,
      width:"100%",
      textAlign:"center",
      marginTop: theme.spacing(3)
  },
  title:{
      marginTop:theme.spacing(1),
      marginBottom:theme.spacing(1),
  },
  progress:{
      marginTop:theme.spacing(2),
      marginBottom:theme.spacing(2),
      width: '100%',
      '& > * + *': {
          marginTop: theme.spacing(1),
      },
  },
  info:{
      marginBottom:theme.spacing(1.2),
      marginTop:theme.spacing(1.2),
      width:"100%",
  },
  infoHead:{
      position: "relative",
      width:"80px",
  },
  infoBody:{
      left:"90px",
      position: "relative",
      marginTop:theme.spacing(-2.5),
  },
  statusNormal:{
      marginLeft:theme.spacing(1),
  },
  statusPending:{
      marginBottom:theme.spacing(-0.9),
      marginLeft:theme.spacing(1),
      color:blue[500]
  },
  statusSuccess:{
      marginBottom:theme.spacing(-0.9),
      marginLeft:theme.spacing(1),
      color:green[500]
  },
  statusFailed:{
      marginBottom:theme.spacing(-0.9),
      marginLeft:theme.spacing(1),
      color:red[500]
  }
}));

function TransactionInfo ({ reverseCallback, tx, amount, symbol }) {
  const classes = useStyles();
  const [state, setState] = useState({pendingOver: false, td: null})
  const { hash, to, chainId, nonce, data, value } = tx
  
  const reverseBack = e => {
    if (reverseCallback) {
      reverseCallback();
    }
  }

  function getStatus () {
    const { pendingOver, td } = state;
    const status = td ? td.status : "0";
    let result = pendingOver ?
      (status === 1
        ? { icon: CheckCircleOutline, str: "已完成", status: "success" }
        : { icon: ErrorOutline, str: "失败", status: "failed" }
      ) :
      {icon: CircularProgress, str:"执行中...", status:"pending"}
    return result;
  }

  useEffect(() => {
    if (tx) {
      let stale = false;
      tx.wait().then(td => {
        if (!stale) {
          setState({
            pendingOver: true,
            td
          })
        }
      }).catch(err => { })
      
      return () => {
        stale = true;
      }
    }
  })

  function showInfoItem (header, body, CustomIcon, status) {
    let style_class;
    switch (status) {
      case 'pending':
        style_class = classes.statusPending;
        break;
      case 'failed':
        style_class = classes.statusFailed;
        break;
      case 'success':
        style_class = classes.statusSuccess;
        break;
      default:
        style_class = classes.statusNormal;
    }

    return (
      <div className={classes.info}>
        <div className={classes.infoHead}>
          {header+":"}
        </div>
        <div className={classes.infoBody}>
          {status && <CustomIcon size={status === 'pending' ? "1.5rem" : 'normal'} className={style_class} />}
          <span className={style_class}>
            {body}
          </span>
        </div>

      </div>
    )
  }

  const url = getEtherscanLink(chainId, hash, 'transaction')
  const component_a = <a href={url} rel="noopener noreferrer" target='_blank'>EtherScan上查看</a>
  const { icon, str, status } = getStatus();
  return (
    <div className={classes.container}>
      <Typography variant="h5" className={classes.title} align='center' color="textPrimary">
        简要交易信息
      </Typography>
      {showInfoItem('交易网络', getNetwordByChainId(chainId))}
      {showInfoItem('交易哈希', shortenAddress(hash, 12))}
      {showInfoItem('nonce', nonce)}
      {showInfoItem('交易类型', 'ETH转账')}
      {showInfoItem('接受地址', to)}
      {showInfoItem('转账数量', `${utils.formatEther(value)}ETH`)}
      {showInfoItem('查看详情', component_a)}
      {showInfoItem('交易状态', str, icon, status)}
      <div className={classes.progress}>
        <LinearProgress variant={state.pendingOver ? "determinate" : "indeterminate"} value={100} />
        <LinearProgress variant={state.pendingOver ? "determinate":"indeterminate" } color="secondary" value={100} />
      </div>
      <div className={classes.submit}>
        <Button variant="contained" color="primary" style={{width:"40%"}} onClick={reverseBack}>
          返回
        </Button>
      </div>
    </div>
  );

}

export default TransactionInfo;