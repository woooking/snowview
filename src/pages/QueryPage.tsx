import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles, WithStyles } from 'material-ui';
import SearchForm from '../components/SearchForm';
import GraphTab from '../components/GraphTab';
import { fetchGraphWorker } from '../redux/action';
import { GRAPH_PREDEFINED_QUERIES } from '../config';
import { RootState } from '../redux/reducer';
import Typography from 'material-ui/Typography';

const styles = () => ({
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
    project: string;
}

class QueryPage extends React.Component<QueryPageProps & WithStyles<'brand' | 'cypher'>> {

    render() {
        const {project} = this.props;

        return (
            <div>
                <SearchForm
                    predefinedQueries={GRAPH_PREDEFINED_QUERIES}
                    callback={(param: { query: string }) => fetchGraphWorker({project, query: param.query})}
                />
                {this.props.cypher.length > 0 &&
                <div className={this.props.classes.cypher}>
                    <Typography>This natural language is translated as the SQL:</Typography>
                    <Typography>{this.props.cypher}</Typography>
                </div>
                }
                <GraphTab project={project}/>
            </div>
        );
    }
}

export default withStyles(styles)<{ project: string }>(connect(mapStateToProps)(QueryPage));
