import * as React from 'react';
import { connect } from 'react-redux';
import ResultPage from './pages/ResultPage';
import IndexPage from './pages/IndexPage';
import { RootState } from './redux/reducer';

const mapStateToProps = (state: RootState) => {
    return {
        page: state.page
    };
};

interface AppProps {
    page: string;
}

class App extends React.Component<AppProps, {}> {
    render() {
        return this.props.page === 'index' ? <IndexPage/> : <ResultPage/>;
    }
}

export default connect(mapStateToProps)(App);
