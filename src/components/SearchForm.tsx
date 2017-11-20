import * as React from 'react';
import { fetchDocumentResultWorker } from '../redux/action';
import { connect } from 'react-redux';
import { Input, withStyles, WithStyles } from 'material-ui';
import { RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import { Theme } from 'material-ui/styles';
import { ChangeEvent, FormEvent } from 'react';
import SearchIcon from 'material-ui-icons/Search';
import Button from 'material-ui/Button';

const styles = (theme: Theme) => ({
    container: {
        margin: theme.spacing.unit * 2
    },
    form: {
        width: '50%'
    },
    search: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        width: '80%',
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
    query: state.documentResult.query
});

interface SearchFormProps {
    query: string;
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
        this.setState({input: this.props.query});
    }
    
    componentWillReceiveProps(nextProps: SearchFormProps & SearchFormStyles) {
        this.setState({input: nextProps.query});
    }
    
    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.dispatch(fetchDocumentResultWorker({query: this.state.input}));
    }
    
    handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({input: event.target.value});
    }
    
    render() {
        const {classes} = this.props;
        
        return (
            <form className={classes.form} onSubmit={this.handleSubmit}>
                <Input
                    className={classes.search}
                    type="search"
                    placeholder="Search"
                    value={this.state.input}
                    onChange={this.handleChange}
                />
                <Button type="submit" color="contrast">
                    <SearchIcon/>
                </Button>
            </form>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(SearchForm));
