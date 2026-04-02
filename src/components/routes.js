import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {createBrowserHistory} from "history";
import SignInView from '../views/SignIn';
import SignUpView from '../views/SignUp';
import HomeView  from '../views/Dashboard/Home';
import ChartView from '../views/Dashboard/Chart';
import OAuthCallback from '../views/OAuthCallback';
import Settings from '../views/Settings';

const hist = createBrowserHistory();

const routes = () => (
    <Router history={hist}>
        <Route exact path="/" component={SignInView}/>
        <Route path="/login" component={SignInView}/>
        <Route path="/register" component={SignUpView}/>
        <Route path="/home" component={HomeView}/>
        <Route path="/trainee/review" component={ChartView}/>
        <Route path="/oauth-callback" component={OAuthCallback}/>
        <Route path="/settings" component={Settings}/>
    </Router>
)
export default routes;
