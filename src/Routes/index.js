import React, {lazy, Suspense} from 'react';
import { useGlobal } from '../Contexts/GlobalProvider';
import { useStorage } from '../Contexts/StorageProvider';
import { Route, Switch, Redirect } from "react-router-dom"
import { withRouter } from 'react-router';

const ImportWallet = lazy(() => import('../Views/ImportWallet'));
const CreateWallet = lazy(() => import('../Views/CreateWallet'));
const SignIn = lazy(() => import('../Views/SignIn'));
const WalletDetail = lazy(() => import('../Views/WalletDetail'));

function SwitchRoute ({ history, path }) {
  history.push(path);
  return null;
}

function AdminRoutes ({ history }) {
  const storage = useStorage();
  const { isLogin } = useGlobal();
  const hasAccount = storage && storage.length !== 0;

  if (!storage) {
    return null;
  }

  return (
    <Suspense fallback = {null}>
      <Switch>
        <Route path="/import" component={ImportWallet} />
        <Route parh="/create" >
          {hasAccount ? <SwitchRoute history={history} path='/sign' />:<CreateWallet />}
        </Route>
        <Route path='/sign' >
          {hasAccount ? <SignIn /> : <SwitchRoute history={history} path='/create' />}
        </Route>
        <Route path='/detail'>
          {hasAccount ? (isLogin ? <WalletDetail /> : <SwitchRoute history={history} path='/sign' />) : <SwitchRoute history={history} path='/create' />}
        </Route>
        <Redirect from='/' to='detail' />
      </Switch>
    </Suspense>
  )

}

export default withRouter(AdminRoutes);
