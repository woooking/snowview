import * as React from 'react';
import * as $ from 'jquery';
import { Component } from 'react';
import { Dispatch } from 'redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { LinearProgress, Typography, withStyles, WithStyles } from 'material-ui';
import { History } from 'history';
import { RootState } from '../../../redux/reducer';
import D3Chord from '../../../components/D3Chord';
import { name2color } from '../../../utils/utils';
import Grid from 'material-ui/Grid';
import Statistic from '../../../components/Statistic';
import { container } from '../../../variables/styles';
import { StyleRules } from 'material-ui/styles';
import { NAV_URL } from '../../../config';
import { NavNode, NavRelation, NavResult } from '../../../model';
import { none, Option, some } from 'ts-option';

interface DiagramTabState {
  navGraph: {
    fetching: boolean;
    nodes: NavNode[];
    relations: NavRelation[];
    matrix: Option<number[][]>;
  };
}

interface DiagramTabRouteProps {
  project: string;
}

interface DiagramTabProps extends RouteComponentProps<DiagramTabRouteProps> {
  dispatch: Dispatch<RootState>;
  history: History;
}

type DiagramTabStyleKeys = 'container' | 'white' | 'progress' | 'info';

type DiagramTabStyles = WithStyles<DiagramTabStyleKeys>;

const styles = () => ({
  container: {
    paddingTop: '60px',
    ...container
  },
  info: {
    fontSize: '1.5rem',
    margin: '20px'
  }
}) as StyleRules<DiagramTabStyleKeys>;

class DiagramTab extends Component<DiagramTabProps & DiagramTabStyles, DiagramTabState> {
  state: DiagramTabState = {
    navGraph: {
      fetching: false,
      nodes: [],
      relations: [],
      matrix: none
    }
  };

  changeFetch = (fetching: boolean) => {
    this.setState(prevState => ({
      navGraph: Object.assign(prevState, {fetching})
    }));
  }

  resultToState = (result: NavResult) => {
    const ns = result.nodes;
    const d = ns.map(() => ns.map(() => 0));
    result.relationships.forEach(r => d[r.startNode][r.endNode] += r.count);

    return {
      navGraph: {
        fetching: false,
        nodes: result.nodes,
        relations: result.relationships,
        matrix: some(d)
      }
    };
  }

  componentDidMount() {
    this.changeFetch(true);

    $.post(NAV_URL, {project: this.props.match.params.project})
      .then((result: NavResult) => this.setState(this.resultToState(result)))
      .catch(() => this.changeFetch(false));
  }

  render() {
    const {classes} = this.props;
    const {navGraph} = this.state;

    let navBody = <LinearProgress className={classes.progress}/>;

    if (!navGraph.fetching) {
      navBody = navGraph.matrix.isEmpty ?
        <Typography className={classes.white}>Failed to load nav graph</Typography> : (
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={5}>
              <D3Chord
                id="nav-d3"
                data={navGraph.matrix.get}
                colors={navGraph.nodes.map(n => name2color(n.label))}
                labels={navGraph.nodes.map(n => `${n.label}(${n.count})`)}
              />
            </Grid>
            <Grid item={true} xs={7}>
              <Typography className={classes.info}>Nodes:</Typography>
              <Grid container={true} spacing={8}>
                {navGraph.nodes.map(node => (
                  <Grid style={{textAlign: 'center'}} key={node.label} item={true} lg={3} sm={4}>
                    <Statistic num={node.count} label={node.label}/>
                  </Grid>
                ))}
              </Grid>
              <Typography className={classes.info}>Edges:</Typography>
              <Grid container={true} spacing={8}>
                {navGraph.relations.map(relation => (
                  <Grid
                    style={{textAlign: 'center'}}
                    key={`${relation.startNode}-${relation.endNode}-${relation.type}`}
                    item={true}
                    lg={3}
                    sm={4}
                  >
                    <Statistic num={relation.count} label={relation.type}/>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        );
    }

    return (
      <div className={classes.container}>
        {navBody}
      </div>
    );
  }
}

export default withStyles(styles)<{}>(withRouter(DiagramTab));