import { Button, IconButton, ListItemText, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { Dehaze, MoreHoriz } from "@material-ui/icons";
import DescriptionIcon from '@material-ui/icons/Description';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { makeStyles } from "@material-ui/core/styles"
import React, { useRef, useState } from "react";
import { useGlobal } from "../../Contexts/GlobalProvider"
import copy from 'copy-to-clipboard';
import { isMobile } from "react-device-detect";
import { useSimpleSnackbar } from "../SimpleSnackbar"
import { getEtherscanLink, shortenAddress } from "../../Utils";
import { getChainIdByNetwork } from "../../Utils";
import AccountDetail from "../AccountDetail"

const COPY_TO_CLIPBOARD = '复制到剪贴板';
const COPIED = '已复制';

const useStyles = makeStyles(theme => ({
  Container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: "100%"
  },
  accountBtn: {
    marginTop: theme.spacing(-1)
  },
  menuPaper: {
    border: '1px solid #d3d4d5',
    backgroundColor: "#000000BB",
    color: 'white'
  },
  icon: {
    marginRight: theme.spacing(2)
  }
}));

function DetailHeader () {
  const classes = useStyles();
  const { wallet, network } = useGlobal();
  const { address } = wallet;
  const [clickTip, setClickTip] = useState(COPY_TO_CLIPBOARD);
  const showSnackbar = useSimpleSnackbar();
  const anchorRefAccount = useRef(null);
  const [state, setState] = useState({
    accountOpen: false,
    accountDetail: false
  });

  const copyAddress = (e) => { 
    e.preventDefault();
    if (copy(address)) {
      if (isMobile) {
        showSnackbar(COPIED, 'info');
      } else {
        setClickTip(COPIED);
      }
    }
  };

  const closeAddressTip = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setClickTip(COPY_TO_CLIPBOARD);
    }, 500);
  }

  const showAccountMenu = e => {
    e.preventDefault();
    setState({
      ...state,
      accountOpen: true
    });
  }

  const handleCloseAccount = e => {
    e.preventDefault();
    setState({
      ...state,
      accountOpen: false
    });
  }

  const handleListKeyDownAccount = e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setState({
        ...state,
        accountOpen: false
      });
    }
  }

  const handleCloseDetail = () => {
    setState({
      accountOpen: false,
      accountDetail: false
    });
  }

  const showAccountDetail = e => {
    setState({
      ...state,
      accountOpen: false,
      accountDetail: true
    });
  }

  const viewScan = e => {
    let chainId = getChainIdByNetwork(network);
    const { address } = wallet;
    let url = getEtherscanLink(chainId, address, 'address');
    window.open(url);
    setState({
      ...state,
      accountOpen: false,
      accountDetail: false
    });
  }
  
  const { accountOpen, accountDetail } = state;

  return (
    <div className={classes.Container}>
      <div>
        <Tooltip title="菜单">
          <IconButton color="inherit" aria-label="Menu">
            <Dehaze />
          </IconButton>
        </Tooltip>
      </div>
      <div className={classes.accountBtn}>
        <Tooltip title={clickTip} onClose={closeAddressTip}>
          <Button onClick={copyAddress} style={{borderRadius: 20}}>
            <ListItemText primary="我的账号" secondary={shortenAddress(address)} />
          </Button>
        </Tooltip>
      </div>
      <div>
        <Tooltip title="账号选项">
          <IconButton
            ref={anchorRefAccount}
            color="inherit"
            aria-label="Menu"
            aria-haspopup="true"
            aria-controls={accountOpen ? 'menu-list-grow' : undefined}
            onClick={showAccountMenu}
          >
            <MoreHoriz />
          </IconButton>
        </Tooltip>
        <Menu
          id="customized-menu-account"
          keepMounted
          open={accountOpen}
          anchorEl={anchorRefAccount.current}
          onClose={handleCloseAccount}
          onKeyDown={handleListKeyDownAccount}
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          classes={{
            paper:classes.menuPaper
          }}        
        >
          <MenuItem onClick={showAccountDetail}>
            <DescriptionIcon className={classes.icon} /> 账户详情
          </MenuItem>
          <MenuItem onClick={viewScan}>
            <CallMadeIcon  className={classes.icon} /> 在Etherscan上查看
          </MenuItem>
        </Menu>
      </div>
      {<AccountDetail open={accountDetail} closeCallback={handleCloseDetail} />}
    </div>
  )
}

export default DetailHeader;