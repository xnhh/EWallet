import { makeStyles, withStyles, createTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import CircleIcon from '@material-ui/icons/FiberManualRecord';
import MenuItem from '@material-ui/core/MenuItem';
import DoneIcon from '@material-ui/icons/Done';
import Divider from '@material-ui/core/Divider';
import { purple,green } from '@material-ui/core/colors';
import { useRef, useState, useEffect } from "react";
import { ThemeProvider } from '@material-ui/styles';
import Menu from '@material-ui/core/Menu';
import { NET_WORKS, NET_WORKS_NAME } from "../../Constants"
import { isMobile } from 'react-device-detect';
import { useUpdateGlobal } from '../../Contexts/GlobalProvider';
import { getInfuraProviderByNetwork } from "../../Utils";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  btnIcon:{
      fontSize: 15,
      height:40,
      fontWeight: "solid",
      border: 2,
      borderRadius: 25,
      borderStyle: "solid",
      borderColor: "black"
  },
  btnContext:{
     marginTop: theme.spacing(0.4),
  },
  btnText:{
      position:'relative',
      top:theme.spacing(-0.8),
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    marginTop:theme.spacing(isMobile ? 0 : 1)
  },
}))(MenuItem);

const colorType = {
  'homestead':'primary',
  'ropsten':'secondary',
  'rinkeby':'action',
  'kovan':'error',
  'localhost':'inherit',
}

const custom_theme = createTheme({
  palette: {
      primary:{
          main:green[500]
      },
      secondary:{
          main:purple[500],
      },
  },
});

function MenuBtn () {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const updateNetwork = useUpdateGlobal();
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };
  
  const handleClose = (event) => { 
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleSelected = key => () => {
    if (selectedIndex === key) {
      return;
    }
    setSelectedIndex(key);
    setOpen(false);
    updateNetwork({
      network: NET_WORKS[key],
      provider: getInfuraProviderByNetwork(NET_WORKS[key])
    });
   }

  const showOneItem = (net, key) => {
    let menuPos = key === 0 ? {textAlign:'center'} : {textAlign:"left"}
    let _color = colorType[NET_WORKS[key]];
    return (
      <StyledMenuItem
          key={net}
          disabled={key===0}
          selected={key===selectedIndex}
          onClick={handleSelected(key)}
      >
          {key !== 0 && <DoneIcon color='primary' visibility={selectedIndex === key ? "show" : "hidden"}/>}
          {key !== 0 && <CircleIcon color={_color}/>}
          <div style={{width:"100%",...menuPos}}>
              {net}
              {key===0 && <Divider/>}
          </div>
      </StyledMenuItem>
    )
  }

  useEffect(() => {
    if (prevOpen.current === true && open === false) { 
      anchorRef.current.focus();
    }
    prevOpen.current = open;
   }, [open])

  function showMenuItems() {
    return NET_WORKS_NAME.map((net, key) => showOneItem(net, key));
  }

  return (
    <div className={classes.root}>
      <IconButton
        className={classes.btnIcon}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <div className={classes.btnContext}>
          <CircleIcon color={colorType[NET_WORKS[selectedIndex]]} />
          <span className={classes.btnText}>
            {NET_WORKS_NAME[selectedIndex]}
          </span>
          <DownIcon color={colorType[NET_WORKS[selectedIndex]]}/>
        </div>    
      </IconButton>
      <ThemeProvider theme={custom_theme}>
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorRef.current}
          keepMounted
          open={open}
          onClose={handleClose}
          onKeyDown={handleListKeyDown}
        >
          {showMenuItems()}
        </StyledMenu>
      </ThemeProvider>
    </div>
  )
}
 
export default MenuBtn;