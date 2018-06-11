import * as React from 'react';
import { Route, Switch } from 'react-router';
import Sidebar from './components/Sidebar/Sidebar';
import appRoutes from './routes/app';
import { withStyles } from 'material-ui';
import appStyle, { AppStyle } from './variables/styles/AppStyle';
import Footer from './components/Footer/Footer';

const image = require('./assets/img/sidebar.jpg');
const logo = require('./assets/img/logo.png');

class App extends React.Component<AppStyle, {}> {
  render() {
    const {classes} = this.props;

    return (
      <div>
        <Sidebar logo={logo} logoText="" image={image} routes={appRoutes}/>
        <div className={classes.mainPanel}>
          <div className={classes.content}>
            <Switch>
              {appRoutes.map((prop, key) =>
                <Route exact={prop.exact} path={prop.path} component={prop.component} key={key}/>
              )}
            </Switch>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}

export default withStyles(appStyle)<{}>(App);
