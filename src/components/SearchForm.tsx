import * as React from 'react';
import { fetchDocumentResult } from '../redux/action';
import { connect } from 'react-redux';
import { Button, Input, withStyles, WithStyles } from 'material-ui';
import CodeModal from './CodeModal';
import { RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import { Theme } from 'material-ui/styles';
import { ChangeEvent, FormEvent } from 'react';
import { Question } from '../model';

const styles = (theme: Theme) => ({
    container: {
        margin: theme.spacing.unit * 2
    },
    form: {
        width: '95%'
    },
    search: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        width: '100%',
        flex: 1,
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
});

const mapStateToProps = (state: RootState) => ({
    question: state.question
});

interface SearchFormProps {
    question: Question;
    dispatch: Dispatch<RootState>;
}

type SearchFormStyles =
    WithStyles<'container' | 'form' | 'search'>;

class SearchForm extends React.Component<SearchFormProps & SearchFormStyles, { input: string }> {
    constructor(props: SearchFormProps & SearchFormStyles) {
        super(props);

        this.state = {
            input: ''
        };
    }

    componentDidMount() {
        this.setState({input: this.props.question.query});
    }

    componentWillReceiveProps(nextProps: SearchFormProps & SearchFormStyles) {
        this.setState({input: nextProps.question.query});
    }

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.dispatch(fetchDocumentResult({query: this.state.input}));
    }

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({input: event.target.value});
    }

    render() {
        const {classes} = this.props;

        return (
            <div>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <Input
                        className={classes.search}
                        type="search"
                        placeholder="Search"
                        value={this.state.input}
                        onChange={this.handleChange}
                        multiline={true}
                    />
                    <Button type="submit" color="contrast">Search</Button>
                    {this.props.question.query2 &&
                    <CodeModal contrast={true} label="Detail" content={this.props.question.query2}/>}
                </form>
            </div>

        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(SearchForm));
