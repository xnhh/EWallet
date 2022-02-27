import { Button, IconButton, ListItemText, Tooltip } from "@material-ui/core";
import { Dehaze, MoreHoriz } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles"
import { useState } from "react";
import { useGlobal } from "../../Contexts/GlobalProvider"
import copy from 'copy-to-clipboard';
import { isMobile } from "react-device-detect";
import { useSimpleSnackbar } from "../SimpleSnackbar"
import { shortenAddress } from "../../Utils";

const COPY_TO_CLIPBOARD = '复制到剪贴板';
const COPIED = '已复制';

const useStyles = makeStyles(theme => ({
  Container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: "100%"
  },
  accountBtn: {
    marginTop:theme.spacing(-1)
  }
}));

function DetailHeader () {
  const classes = useStyles();
  const { wallet } = useGlobal();
  const { address } = wallet;
  const [clickTip, setClickTip] = useState(COPY_TO_CLIPBOARD);
  const showSnackbar = useSimpleSnackbar();

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
          <IconButton color="inherit" aria-label="Menu" aria-haspopup="true">
            <MoreHoriz />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default DetailHeader;