import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import SearchForm from '../components/SearchForm';
import GraphTab from '../components/GraphTab';
import { fetchGraphWorker } from '../redux/action';
import { GRAPH_PREDEFINED_QUERIES } from '../config';
import { RootState } from '../redux/reducer';
import Typography from 'material-ui/Typography';

const styles = (theme: Theme) => ({
    brand: {
        textDecoration: 'none'
    },
    cypher: {
        padding: '8px'
    }
});

const mapStateToProps = (state: RootState) => ({
    cypher: state.graph.cypher,
});

interface QueryPageProps {
    cypher: string;
}

class QueryPage extends React.Component<QueryPageProps & WithStyles<'brand' | 'cypher'>> {

    render() {
        return (
            <div>
                <SearchForm
                    predefinedQueries={GRAPH_PREDEFINED_QUERIES}
                    callback={(param: { query: string }) => fetchGraphWorker(param)}
                />
                {this.props.cypher.length > 0 &&
                <div className={this.props.classes.cypher}>
                    <Typography>This natural language is translated as the SQL:</Typography>
                    <Typography>{this.props.cypher}</Typography>
                </div>
                }
                <GraphTab/>
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(QueryPage));
