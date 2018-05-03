import * as React from 'react';
import { connect } from 'react-redux';
import QueryPage from './QueryPage';
import Tabs, { Tab } from 'material-ui/Tabs';
import DocumentPage from './DocumentPage';
import DiagramPage from './DiagramPage';
import logo from '../assets/img/logo.jpg';

type TabType = 'document' | 'graph' | 'diagram';

class IndexPage extends React.Component<{}, {tab: TabType}> {
    state: {tab: TabType} = {
        tab: 'graph'
    };
    render() {
        return (
            <div>
                <div style={{float: 'left'}}>
                    <img style={{marginLeft: '16px', display: 'inline'}} height={48} src={logo} alt="logo"/>
                </div>
                <Tabs
                    value={this.state.tab}
                    onChange={(e, v) => this.setState({tab: v})}
                    indicatorColor="primary"
                    textColor="primary"
                    scrollable={true}
                    scrollButtons="auto"
                >
                    <Tab value="graph" label="Graph"/>
                    <Tab value="document" label="Document"/>
                    <Tab value="diagram" label="Nav Graph"/>
                </Tabs>
                {this.state.tab === 'document' && <DocumentPage/>}
                {this.state.tab === 'graph' && <QueryPage/>}
                {this.state.tab === 'diagram' && <DiagramPage/>}
            </div>
        );
    }
}

export default connect()(IndexPage);