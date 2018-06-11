import * as React from 'react';
import QueryTab from './GraphTab';
import Tabs, { Tab } from 'material-ui/Tabs';
import DocumentTab from './DocumentTab';
import DiagramTab from './DiagramTab';
import { Route, RouteComponentProps, Switch } from 'react-router';

interface ProjectPageRouteProps {
  project: string;
  tab: TabType;
}

type TabType = 'diagram' | 'graph' | 'document';

class ProjectPage extends React.Component<RouteComponentProps<ProjectPageRouteProps>> {
  render() {
    const {project, tab} = this.props.match.params;

    return (
      <div>
        <Tabs
          value={tab}
          onChange={(e, v) => this.props.history.push(`/demo/${project}/${v}`)}
          indicatorColor="primary"
          textColor="primary"
          scrollable={true}
          scrollButtons="auto"
        >
          <Tab value="diagram" label="图谱概览"/>
          <Tab value="graph" label="智能问答"/>
          <Tab value="document" label="语义搜索"/>
        </Tabs>
        <Switch>
          <Route path="/demo/:project/diagram" component={DiagramTab}/>
          <Route path="/demo/:project/graph" component={QueryTab}/>
          <Route path="/demo/:project/document" component={DocumentTab}/>
        </Switch>
      </div>
    );
  }
}

export default ProjectPage;