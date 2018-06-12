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
        <RegularCard cardTitle="Authors" headerColor="purple">
          <p>
            SnowGraph由北京大学信息科学技术学院软件复用小组研发。
            该小组以谢冰教授为核心，主要研究内容涵盖软件工程、软件复用技术的多个方面，包括：软件构建技术、软件资源管理、软件数据挖掘、智能软件开发方法等。
            SnowGraph的主要研发人员包括（2016年至今）：
          </p>
          <h5>Faulty:</h5>
          <MatTable tableData={faulty}/>
          <h5>Project Manager:</h5>
          <MatTable tableData={projectManager}/>
          <h5>Committers:</h5>
          <MatTable tableData={committers}/>
          <h5>Sponsors:</h5>
          <MatTable tableData={sponsors}/>
        </RegularCard>
      </div>
    );
  }
}

export default withStyles(styles)<{}>(AboutPage);
