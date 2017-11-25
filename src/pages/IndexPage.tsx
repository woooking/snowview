import * as React from 'react';
import { ChangeEvent, FormEvent, Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Button, CircularProgress, Input, LinearProgress, Typography, withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import SearchIcon from 'material-ui-icons/Search';
import {
    fetchDocumentResultWorker, fetchGraphWorker, fetchNavGraphWorker,
    fetchRandomQuestionWorker
} from '../redux/action';
import { RootState } from '../redux/reducer';
import { withRouter } from 'react-router';
import { History } from 'history';
import { NavGraphState } from '../redux/navGraphReducer';
import { Neo4jNode, SnowRelation } from '../model';
import D3Graph from '../components/D3Graph';
import { translation } from '../translation';
import './IndexPage.css';

const styles = (theme: Theme) => ({
    page1: {
        background: theme.palette.primary[500],
    },
    page2: {
        background: theme.palette.primary[900],
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '70%',
    },
    title: {
        color: theme.palette.common.white
    },
    introduction: {
        color: theme.palette.primary[50]
    },
    featureList: {
        color: theme.palette.primary[50]
    },
    search: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    searchInput: {
        flex: 1,
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        color: theme.palette.common.white,
        '&:before': {
            backgroundColor: theme.palette.primary[400],
        },
        '&:hover:not(.disabled):before': {
            backgroundColor: theme.palette.primary[200],
        },
        '&:after': {
            backgroundColor: theme.palette.primary[50],
        },
    },
    progress: {
        width: '100%',
        margin: theme.spacing.unit * 4
    }
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    fetchingRandomQuestion: state.fetchingRandomQuestion,
    navGraph: state.navGraph
});

interface IndexPageProps {
    fetchingRandomQuestion: boolean;
    navGraph: NavGraphState;
    dispatch: Dispatch<RootState>;
    history: History;
}

type IndexPageStyles =
    WithStyles<'page1' | 'page2' | 'container' | 'title' | 'introduction' | 'featureList' | 'search' | 'searchInput'
        | 'progress'>;

class Graph extends D3Graph<Neo4jNode, SnowRelation> {
}

class IndexPage extends Component<IndexPageProps & IndexPageStyles, { input: string }> {
    state = {
        input: ''
    };

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {dispatch} = this.props;
        if (this.state.input === '') {
            dispatch(fetchRandomQuestionWorker((result: string) => this.setState({input: result})));
        } else {
            dispatch(fetchDocumentResultWorker({query: this.state.input}));
            dispatch(fetchGraphWorker({query: this.state.input}));
            this.props.history.push('/result');
        }
    }

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({input: event.target.value});
    }

    componentDidMount() {
        this.props.dispatch(fetchNavGraphWorker({}));
    }

    render() {
        const {classes, fetchingRandomQuestion, navGraph} = this.props;

        const nodes = navGraph.nodes
            .valueSeq()
            .toArray();

        const links = navGraph.relations
            .valueSeq()
            .toArray();

        return (
            <div>
                <div className={`${classes.page1} page`}>
                    <div className={classes.container}>
                        <Typography component="h1" type="display4" className={classes.title}>SEI SnowGraph</Typography>
                        <Typography component="h2" type="headline" className={classes.introduction}>
                            SnowGraph (Software Knowledge Graph) is a project for creating software-specific
                            question-answering
                            bot. Given a software project and various software engineering data of it, you can use
                            SnowGraph
                            to:
                        </Typography>
                        <ul className={classes.featureList}>
                            <li>
                                <Typography component="h3" type="body1" className={classes.introduction}>
                                    Creating a software-specific knowledge graph automatically. SnowGraph will extract
                                    entities
                                    from software engineering data, analyze relationships between them, and fuse them
                                    into a
                                    uniform graph database. Software developers can access the software-specific
                                    knowledge
                                    graph
                                    through graphic user interface or graph query language.
                                </Typography>
                            </li>
                            <li>
                                <Typography component="h3" type="body1" className={classes.introduction}>
                                    Creating a software-specific question answering bot automatically. Given a natural
                                    language
                                    user question about the software project, the QA bot can return passages from
                                    software
                                    engineering data to answer the question.
                                </Typography>
                            </li>
                        </ul>
                        <Typography component="h2" type="headline" className={classes.introduction}>
                            Get Started:
                        </Typography>
                        <form className={classes.search} onSubmit={this.handleSubmit}>
                            <Input
                                className={classes.searchInput}
                                placeholder="Please enter your question..."
                                onChange={this.handleChange}
                                value={this.state.input}
                            />
                            {fetchingRandomQuestion ?
                                <CircularProgress color="accent" size={55}/> :
                                <Button fab={true} type="submit" color="accent"><SearchIcon/></Button>}
                        </form>
                    </div>
                </div>
                <div className={`${classes.page2} page`}>
                    <div className={classes.container}>
                        <Typography component="h1" type="display3" className={classes.title}>
                            Overview of the Graph
                        </Typography>
                        {navGraph.fetching ?
                            <LinearProgress className={classes.progress}/> :
                            <Graph
                                id="nav-d3"
                                nodes={nodes}
                                links={links}
                                getNodeID={n => n._id.toString()}
                                getNodeColor={n => {
                                    const l = translation.classes[n._labels[0]];
                                    return l && l.nodeFillColor ? l.nodeFillColor : '#DDDDDD';
                                }}
                                getNodeLabel={n => n._labels[0]}
                                getNodeText={n => ''}
                                getLinkID={d => d.id}
                                getLinkText={d => d.types.toString()}
                                getSourceNodeID={d => d.source.toString()}
                                getTargetNodeID={d => d.target.toString()}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(withRouter(IndexPage)));
