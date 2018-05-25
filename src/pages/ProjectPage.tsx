import * as React from 'react';
import QueryPage from './QueryPage';
import Tabs, { Tab } from 'material-ui/Tabs';
import DocumentTab from './DocumentTab';
import DiagramPage from './DiagramPage';
import logo from '../assets/img/logo.jpg';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

interface ProjectPageRouteProps {
    project: string;
}

type TabType = 'diagram' | 'graph' | 'document';

class ProjectPage extends React.Component<RouteComponentProps<ProjectPageRouteProps>, {tab: TabType}> {
    state: {tab: TabType} = {
        tab: 'document'
    };

    render() {
        const {project} = this.props.match.params;

        return (
            <div>
                <div style={{float: 'left'}}>
                    <Link to="/">
                        <img style={{marginLeft: '16px', display: 'inline'}} height={48} src={logo} alt="logo"/>
                    </Link>
                </div>
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
                {this.state.tab === 'document' && <DocumentTab project={project}/>}
                {this.state.tab === 'graph' && <QueryPage project={project}/>}
                {this.state.tab === 'diagram' && <DiagramPage project={project}/>}
            </div>
        );
    }
}

export default ProjectPage;