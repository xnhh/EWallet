import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import WalletBar from '../../Components/WalletBar';
import Paper from '@material-ui/core/Paper';
import { isMobile } from 'react-device-detect';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Routes from '../../Routes';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(isMobile ? 8 :10),
        display: "flex",
        justifyContent: "center"
    }
}));

export default function Main() {
  const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid item xs={12} sm={12} md={3}>
                <Paper style={{
                    height: 600,
                    mixHeight: 600
                }}>
                <Router>
                    <WalletBar />
                    <Switch>
                        <Route path="/" component={Routes} />
                    </Switch>  
                </Router>
                </Paper>
            </Grid>
        </div>
    );
}

