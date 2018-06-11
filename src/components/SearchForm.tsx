import * as React from 'react';
import { connect } from 'react-redux';
import { Input, withStyles, WithStyles } from 'material-ui';
import { RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import { Theme } from 'material-ui/styles';
import { ChangeEvent, FormEvent } from 'react';

const styles = (theme: Theme) => ({
    container: {
        margin: theme.spacing.unit * 2
    },
    form: {
        width: '100%',
    },
    search: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        width: `calc(100% - ${theme.spacing.unit * 4}px)`,
        flex: 1,
    },
});

interface SearchFormProps {
    query?: string;
    predefinedQueries: string[];
    callback: Function;
    dispatch: Dispatch<RootState>;
}

type SearchFormStyles = WithStyles<'container' | 'form' | 'search'>;

class SearchForm extends React.Component<SearchFormProps & SearchFormStyles, { input: string }> {
    state = {
        input: ''
    };

    componentDidMount() {
        this.setState({input: this.props.query || ''});
    }

    componentWillReceiveProps(nextProps: SearchFormProps & SearchFormStyles) {
        this.setState({input: nextProps.query || ''});
    }

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const {dispatch, callback} = this.props;

        dispatch(callback({query: this.state.input}));
    }

    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({input: event.target.value});
    }

    render() {
        const {classes, predefinedQueries} = this.props;

        return (
            <form className={classes.form} onSubmit={this.handleSubmit}>
                <Input
                    className={classes.search}
                    type="search"
                    placeholder="Ask a question here..."
                    value={this.state.input}
                    onChange={this.handleChange}
                    inputProps={{list: 'predefined-queries'}}
                />
                <datalist id="predefined-queries">
                    {predefinedQueries.map(q => <option key={q} value={q}/>)}
                </datalist>
            </form>
        );
    }
}

export default withStyles(styles)<{
    predefinedQueries: string[], callback: Function, query?: string
}>(connect()(SearchForm));
