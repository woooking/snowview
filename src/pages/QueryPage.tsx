import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import SearchForm from '../components/SearchForm';
import GraphTab from '../components/GraphTab';
import { fetchGraphWorker } from '../redux/action';
import { GRAPH_PREDEFINED_QUERIES } from '../config';

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
                <SearchForm
                    predefinedQueries={ GRAPH_PREDEFINED_QUERIES }
                    callback={(param: { query: string }) => fetchGraphWorker(param)}
                />
                <GraphTab/>
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect()(QueryPage));
