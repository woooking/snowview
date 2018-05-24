import * as React from 'react';
import { Route, Switch } from 'react-router';
import ProjectPage from './pages/ProjectPage';
import IndexPage from './pages/IndexPage';

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact={true} path="/" component={IndexPage}/>
                    <Route exact={true} path="/:project" component={ProjectPage}/>
                </Switch>
            </div>
        );
    }
}

export default App;
