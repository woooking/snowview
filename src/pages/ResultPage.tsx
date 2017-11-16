import * as React from 'react';
import SearchForm from '../components/SearchForm';
import { AppBar, Tabs, Tab, Toolbar, Typography, withStyles, IconButton, WithStyles } from 'material-ui';
import SearchIcon from 'material-ui-icons/Search';
import { connect } from 'react-redux';
import GraphTab from '../components/GraphTab';
import DocumentTab from '../components/DocumentTab';
import { Theme } from 'material-ui/styles';
import { RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import { changeTab, gotoIndex } from '../redux/action';

const styles = (theme: Theme) => ({
    brand: {
        textDecoration: 'none'
    }
});

const mapStateToProps = (state: RootState) => {
    return {
        tab: state.tab
    };
};

interface ResultPageProps {
    tab: string;
    dispatch: Dispatch<RootState>;
}

class ResultPage extends React.Component<ResultPageProps & WithStyles<'brand'>, {}> {
    state = {
        open: false
    };

    handleSearchClick = () => {
        this.setState({open: !this.state.open});
    }

    render() {
        const {classes, dispatch} = this.props;
        return (
            <div>
                <AppBar color="primary" position="static">
                    <Toolbar>
                        <Typography
                            className={classes.brand}
                            type="title"
                            color="inherit"
                            component="a"
                            onClick={() => dispatch(gotoIndex({}))}
                            {...{href: '#'}}
                        >
                            SEI SNOW Project
                        </Typography>
                        <IconButton color="contrast" onClick={this.handleSearchClick}>
                            <SearchIcon/>
                        </IconButton>
                    </Toolbar>
                    {this.state.open && <SearchForm/>}
                </AppBar>

                <Tabs value={this.props.tab} onChange={(e, v) => dispatch(changeTab(v))}>
                    <Tab value="document" label="Document"/>
                    <Tab value="api-graph" label="API Graph"/>
                </Tabs>

                <DocumentTab visibility={this.props.tab === 'document'}/>
                <GraphTab visibility={this.props.tab === 'api-graph'}/>
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(ResultPage));
