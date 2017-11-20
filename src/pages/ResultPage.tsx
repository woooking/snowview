import * as React from 'react';
import SearchForm from '../components/SearchForm';
import { AppBar, Tabs, Tab, Toolbar, Typography, withStyles, WithStyles } from 'material-ui';
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
                        <SearchForm/>
                    </Toolbar>
                </AppBar>

                <Tabs value={this.props.tab} onChange={(e, v) => dispatch(changeTab(v))}>
                    <Tab value="document" label="Document"/>
                    <Tab value="api-graph" label="API Graph"/>
                </Tabs>

                {this.props.tab === 'document' && <DocumentTab/>}
                {this.props.tab === 'api-graph' && <GraphTab/>}
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(ResultPage));
