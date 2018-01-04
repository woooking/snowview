import * as React from 'react';
import {Component} from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {LinearProgress, Typography, withStyles, WithStyles} from 'material-ui';
import {Theme} from 'material-ui/styles';
import {History} from 'history';
import {fetchNavGraphWorker} from '../redux/action';
import {RootState} from '../redux/reducer';
import {NavGraphState} from '../redux/navGraphReducer';
import D3Chord from '../components/D3Chord';
import {name2color} from '../utils/utils';

const styles = (theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50%',
        width: '50%',
    }
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    navGraph: state.navGraph
});

interface DiagramPageProps {
    navGraph: NavGraphState;
    dispatch: Dispatch<RootState>;
    history: History;
}

type DiagramPageStyles =
    WithStyles<'page1' | 'page2' | 'container' | 'white' | 'introduction' | 'featureList' | 'search' | 'searchInput'
        | 'progress'>;

class DiagramPage extends Component<DiagramPageProps & DiagramPageStyles, { input: string }> {

    componentDidMount() {
        this.props.dispatch(fetchNavGraphWorker({}));
    }

    render() {
        const {classes, navGraph} = this.props;

        let navBody = <LinearProgress className={classes.progress}/>;

        if (!navGraph.fetching) {
            navBody = navGraph.matrix.isEmpty ?
                <Typography className={classes.white}>Failed to load nav graph</Typography> : (
                    <D3Chord
                        id="nav-d3"
                        data={navGraph.matrix.get}
                        colors={navGraph.nodes.map(n => name2color(n.label))}
                        labels={navGraph.nodes.map(n => `${n.label}(${n.count})`)}
                    />
                );
        }

        return (
            <div className={classes.container}>
                {navBody}
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(withRouter(DiagramPage)));