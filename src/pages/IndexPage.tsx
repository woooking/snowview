import * as React from 'react';
import { connect } from 'react-redux';
import QueryPage from './QueryPage';
import Tabs, { Tab } from 'material-ui/Tabs';
import DocumentPage from './DocumentPage';
import DiagramPage from './DiagramPage';

type TabType = 'document' | 'graph' | 'diagram';

class IndexPage extends React.Component<{}, {tab: TabType}> {
    state: {tab: TabType} = {
        tab: 'diagram'
    };
    render() {
        return (
            <div>
                <Tabs
                    value={this.state.tab}
                    onChange={(e, v) => this.setState({tab: v})}
                    indicatorColor="primary"
                    textColor="primary"
                    scrollable={true}
                    scrollButtons="auto"
                >
					<Tab value="diagram" label="图谱概览"/>
                    <Tab value="graph" label="智能问答"/>
                    <Tab value="document" label="语义搜索"/>
                </Tabs>
                {this.state.tab === 'document' && <DocumentPage/>}
                {this.state.tab === 'graph' && <QueryPage/>}
                {this.state.tab === 'diagram' && <DiagramPage/>}
            </div>
        );
    }
}

export default connect()(IndexPage);