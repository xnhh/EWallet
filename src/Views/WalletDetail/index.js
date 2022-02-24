import { makeStyles } from '@material-ui/core/styles';
import DetailHeader from '../../Components/DetailHeader';
import DetailBody from '../../Components/DetailBody';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(3)
  },
  divider: {
    width: "100%",
    marginTop: theme.spacing(-1)
  }
}))

function WalletDetail () {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <DetailHeader />
      <div className={classes.divider}>
        <Divider />
      </div>
      <DetailBody />
      <div className={classes.divider} >
        历史记录
        <Divider />
      </div>
    </div>
  )
}

export default WalletDetail;