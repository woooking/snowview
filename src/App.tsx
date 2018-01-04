import * as React from 'react';
import { Route } from 'react-router';
import AppsDrawer from './pages/IndexPage';
import QueryPage from './pages/QueryPage';

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                <Route exact={true} path="/" component={AppsDrawer}/>
                <Route exact={true} path="/query" component={QueryPage}/>
            </div>
        );
    }
}

export default App;
