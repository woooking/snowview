import * as React from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import SearchForm from '../components/SearchForm';
import GraphTab from '../components/GraphTab';

const styles = (theme: Theme) => ({
    brand: {
        textDecoration: 'none'
    }
});

interface QueryPageProps {
}

class QueryPage extends React.Component<QueryPageProps & WithStyles<'brand'>> {

    render() {
        return (
            <div>
                <AppBar color="primary" position="static">
                    <Toolbar>
                        <SearchForm/>
                    </Toolbar>
                </AppBar>
                <GraphTab/>
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect()(QueryPage));
