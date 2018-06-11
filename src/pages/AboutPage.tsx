import * as React from 'react';
import RegularCard from '../components/Cards/RegularCard';
import MatTable from '../components/MatTable/MatTable';
import { withStyles, WithStyles } from 'material-ui';
import { container } from '../variables/styles';
import { StyleRules } from 'material-ui/styles';

type AboutPageStyleStyleKeys = 'container';

type AboutPageStyle = WithStyles<AboutPageStyleStyleKeys>;

const styles = () => ({
  container: {
    paddingTop: 40,
    ...container
  }
}) as StyleRules<AboutPageStyleStyleKeys>;

const faulty = [{
  key: 'Bing Xie',
  columns: ['Bing Xie', 'Professor, Peking University'],
}, {
  key: 'Yanzhen Zou',
  columns: ['Yanzhen Zou', 'Associated Professor, Peking University'],
}, {
  key: 'Junfeng Zhao',
  columns: ['Junfeng Zhao', 'Associated Professor, Peking University'],
}];

const projectManager = [{
  key: 'Zeqi Lin',
  columns: ['Zeqi Lin', 'PhD Student, Peking University'],
}, {
  key: 'Min Wang',
  columns: ['Min Wang', 'PhD Student, Peking University'],
}];

const committers = [{
  key: 'Jinan Ni',
  columns: ['Jinan Ni', 'Master Student, Peking University'],
}, {
  key: 'Yingkui Cao',
  columns: ['Yingkui Cao', 'PhD Student, Peking University'],
}, {
  key: 'Chenyan Hua',
  columns: ['Chenyan Hua', 'Master Student, Peking University'],
}, {
  key: 'Qi Shen',
  columns: ['Qi Shen', 'PhD Student, Peking University'],
}, {
  key: 'Chunyang Ling',
  columns: ['Chunyang Ling', 'Master Student, Peking University'],
}, {
  key: 'Wenpeng Li',
  columns: ['Wenpeng Li', 'Master Student, Peking University'],
}, {
  key: 'Ying Qian',
  columns: ['Ying Qian', 'Master Student, Peking University'],
}];

const sponsors = [
  {
    columns: [`This project is supported by the National Key Research and Development Program of China\
   (Grant No. 2016YFB1000801).`]
  }, {
    columns: [`The computing resource is supported by the National Key Research and Development Program of China\
   (Grant No. 2016YFB1000805).`],
  }
];

class AboutPage extends React.Component<AboutPageStyle, {}> {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        <RegularCard cardTitle="Faulty" headerColor="red">
          <MatTable tableData={faulty}/>
        </RegularCard>

        <RegularCard cardTitle="Project Managers" headerColor="green">
          <MatTable tableData={projectManager}/>
        </RegularCard>

        <RegularCard cardTitle="Committers" headerColor="orange">
          <MatTable tableData={committers}/>
        </RegularCard>

        <RegularCard cardTitle="Sponsors" headerColor="blue">
          <MatTable tableData={sponsors}/>
        </RegularCard>
      </div>
    );
  }
}

export default withStyles(styles)<{}>(AboutPage);