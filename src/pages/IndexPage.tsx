import * as React from 'react';
import { connect } from 'react-redux';
import {withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import QueryPage from "./QueryPage";
import Tabs, { Tab } from 'material-ui/Tabs';
import DiagramPage from "./DiagramPage";

const styles = (theme: Theme) => ({
    tab: {
    }
});

interface IndexPageProps {
}

type TabType = 'diagrams' | 'query';

class IndexPage extends React.Component<IndexPageProps & WithStyles<'tab'>, {tab: TabType}> {
    state: {tab: TabType} = {
        tab: 'diagrams'
    };
    render() {
        const {classes} = this.props;
        return (
            <div>
                <Tabs value={this.state.tab} onChange={(e, v) => this.setState({tab: v})} indicatorColor="primary" textColor="primary" scrollable scrollButtons="auto">
                    <Tab className={classes.tab} value="diagrams" label="Dashboard"/>
                    <Tab className={classes.tab} value="query" label="Intelli-QA"/>
                </Tabs>
                {this.state.tab === 'diagrams' && <DiagramPage/>}
                {this.state.tab === 'query' && <QueryPage/>}
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect()(IndexPage));