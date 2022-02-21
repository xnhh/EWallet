import {makeStyles} from '@material-ui/core/styles';
import { useGlobal } from '../../Contexts/GlobalProvider';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(3)
  }
}))

function WalletDetail () {
  const classes = useStyles();
  let { wallet } = useGlobal();

  return (
    <div className={classes.container}>
      {wallet.address}
    </div>
  )
}

export default WalletDetail;