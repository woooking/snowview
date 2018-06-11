import * as React from 'react';
import { connect } from 'react-redux';
import SearchForm from '../../../components/SearchForm';
import GraphPanels from './GraphPanels';
import { fetchGraphWorker } from '../../../redux/action';
import { GRAPH_PREDEFINED_QUERIES } from '../../../config';
import { RootState } from '../../../redux/reducer';
import { RouteComponentProps } from 'react-router';
import { LinearProgress, WithStyles } from 'material-ui';
import { container } from '../../../variables/styles';
import withStyles from 'material-ui/styles/withStyles';

const styles = () => ({
  container: {
    paddingTop: '60px',
    ...container
  }
});

const mapStateToProps = (state: RootState) => ({
  query: state.graph.query,
  fetching: state.graph.fetching
});

interface GraphTabRouteProps {
  project: string;
}

type GraphTabStyles = WithStyles<'container'>;

interface GraphTabProps extends RouteComponentProps<GraphTabRouteProps> {
  query: string;
  fetching: boolean;
}

class GraphTab extends React.Component<GraphTabProps & GraphTabStyles, {}> {

  render() {
    const {project} = this.props.match.params;
    const {query, fetching, classes} = this.props;

    return (
      <div>
        <SearchForm
          query={query}
          predefinedQueries={GRAPH_PREDEFINED_QUERIES}
          callback={(param: { query: string }) => fetchGraphWorker({project, query: param.query})}
        />
        {fetching ?
          <div className={classes.container}>
            <LinearProgress/>
          </div>  :
          <GraphPanels project={project}/>
        }
      </div>
    );
  }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(GraphTab));
