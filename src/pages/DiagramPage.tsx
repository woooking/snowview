import * as React from 'react';
import { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { LinearProgress, Typography, withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import { History } from 'history';
import { fetchNavGraphWorker } from '../redux/action';
import { RootState } from '../redux/reducer';
import { NavGraphState } from '../redux/navGraphReducer';
import D3Chord from '../components/D3Chord';
import { name2color } from '../utils/utils';
import Grid from 'material-ui/Grid';
import Statistic from '../components/Statistic';

const styles = (theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        fontSize: '1.5rem',
        margin: '20px'
    }
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    navGraph: state.navGraph
});

interface DiagramPageProps {
    navGraph: NavGraphState;
    project: string;
    dispatch: Dispatch<RootState>;
    history: History;
}

type DiagramPageStyles =
    WithStyles<'container' | 'white' | 'progress' | 'info'>;

class DiagramPage extends Component<DiagramPageProps & DiagramPageStyles, { input: string }> {

    componentDidMount() {
        this.props.dispatch(fetchNavGraphWorker({project: this.props.project}));
    }

    render() {
        const {classes, navGraph} = this.props;

        let navBody = <LinearProgress className={classes.progress}/>;

        if (!navGraph.fetching) {
            navBody = navGraph.matrix.isEmpty ?
                <Typography className={classes.white}>Failed to load nav graph</Typography> : (
                    <Grid container={true} spacing={0}>
                        <Grid item={true} xs={5}>
                            <D3Chord
                                id="nav-d3"
                                data={navGraph.matrix.get}
                                colors={navGraph.nodes.map(n => name2color(n.label))}
                                labels={navGraph.nodes.map(n => `${n.label}(${n.count})`)}
                            />
                        </Grid>
                        <Grid item={true} xs={6}>
                            <Typography className={classes.info}>Nodes:</Typography>
                            <Grid container={true} spacing={0}>
                                {navGraph.nodes.map(node => (
                                    <Grid style={{textAlign: 'center'}} key={node.label} item={true} xs={3}>
                                        <Statistic num={node.count} label={node.label}/>
                                    </Grid>
                                ))}
                            </Grid>
                            <Typography className={classes.info}>Edges:</Typography>
                            <Grid container={true} spacing={0}>
                                {navGraph.relations.map(relation => (
                                    <Grid
                                        style={{textAlign: 'center'}}
                                        key={`${relation.startNode}-${relation.endNode}-${relation.type}`}
                                        item={true}
                                        xs={4}
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

export default withStyles(styles)<{project: string}>(connect(mapStateToProps)(withRouter(DiagramPage)));