import * as React from 'react';
import { Route } from 'react-router';
import ResultPage from './pages/ResultPage';
import IndexPage from './pages/IndexPage';

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                <Route exact={true} path="/" component={IndexPage}/>
                <Route exact={true} path="/index" component={IndexPage}/>
                <Route exact={true} path="/result" component={ResultPage}/>
            </div>
        );
    }
}

export default App;
