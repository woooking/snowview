import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, Toolbar, Typography, withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import { TypographyProps } from 'material-ui/Typography';
import SearchForm from '../components/SearchForm';
import GraphTab from '../components/GraphTab';
import DocumentTab from '../components/DocumentTab';
import { DocumentResultState, RootState } from '../redux/reducer';

const styles = (theme: Theme) => ({
    brand: {
        textDecoration: 'none'
    }
});

const mapStateToProps = (state: RootState) => ({
    documentResult: state.documentResult,
});

interface ResultPageProps {
    documentResult: DocumentResultState;
}

type TabType = 'api-graph' | 'document';

class ResultPage extends React.Component<ResultPageProps & WithStyles<'brand'>, {tab: TabType}> {
    state: {tab: TabType} = {
        tab: 'api-graph'
    };

    render() {
        const {classes, documentResult} = this.props;
        return (
            <div>
                <AppBar color="primary" position="static">
                    <Toolbar>
                        <Typography
                            className={classes.brand}
                            type="title"
                            color="inherit"
                            component={Link as React.ComponentType<TypographyProps>}
                            {...{to: '/'}}
                        >
                            SnowGraph
                        </Typography>
                        <SearchForm/>
                    </Toolbar>
                </AppBar>

                <Tabs value={this.state.tab} onChange={(e, v) => this.setState({tab: v})}>
                    <Tab value="api-graph" label="Graph Browser"/>
                    <Tab value="document" label="QA Bot"/>
                </Tabs>

                {this.state.tab === 'document' && <DocumentTab documentResult={documentResult}/>}
                {this.state.tab === 'api-graph' && <GraphTab/>}
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(ResultPage));
