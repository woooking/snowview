import * as React from 'react';
import { Button, CircularProgress, Input, Typography, withStyles, WithStyles } from 'material-ui';
import SearchIcon from 'material-ui-icons/Search';
import { fetchDocumentResultWorker, fetchGraphWorker, fetchRandomQuestionWorker, gotoResult } from '../redux/action';
import { connect } from 'react-redux';
import { Theme } from 'material-ui/styles';
import { GraphState, RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import { ChangeEvent, FormEvent } from 'react';

const styles = (theme: Theme) => ({
    page: {
        background: theme.palette.primary[500],
        display: 'flex',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center'
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
    }
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    graph: state.graph,
    fetchingRandomQuestion: state.fetchingRandomQuestion
});

interface IndexPageProps {
    graph: GraphState;
    fetchingRandomQuestion: boolean;
    dispatch: Dispatch<RootState>;
}

type IndexPageStyles =
    WithStyles<'page' | 'container' | 'title' | 'introduction' | 'featureList' | 'search' | 'searchInput'>;

class IndexPage extends React.Component<IndexPageProps & IndexPageStyles, { input: string }> {
    
    constructor(props: IndexPageProps & IndexPageStyles) {
        super(props);
        
        this.state = {
            input: ''
        };
    }
    
    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { dispatch } = this.props;
        if (this.state.input === '') {
            this.props.dispatch(fetchRandomQuestionWorker(
                {callback: (result: string) => this.setState({input: result})})
            );
        } else {
            dispatch(fetchDocumentResultWorker({query: this.state.input}));
            dispatch(fetchGraphWorker({query: this.state.input}));
            dispatch(gotoResult({}));
        }
    }
    
    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({input: event.target.value});
    }
    
    
    render() {
        const {classes} = this.props;
        return (
            <div>
                <div className={classes.page}>
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
                            {this.props.fetchingRandomQuestion ?
                                <CircularProgress color="accent" size={55}/> :
                                <Button fab={true} type="submit" color="accent"><SearchIcon/></Button>}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(IndexPage));
