import * as React from 'react';
import { Route } from 'react-router';
import AppsDrawer from './pages/IndexPage';

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                <Route exact={true} path="/" component={AppsDrawer}/>
            </div>
        );
    }
}

export default App;
