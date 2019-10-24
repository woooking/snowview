import * as React from 'react';
import logo from '../../assets/img/logo.png';
import { TextField, WithStyles } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import { StyleRules } from 'material-ui/styles/withStyles';
import { ChangeEvent } from 'react';
import { ProjectInfo } from '../../model';
import { PROJECTS_INFO_URL } from '../../config';
import { Link } from 'react-router-dom';
import MatTable from '../../components/MatTable/MatTable';
import { container, flexContainer } from '../../variables/styles';
import RegularCard from '../../components/Cards/RegularCard';

interface CatalogPageState {
  filter: string;
  projects: ProjectInfo[];
}

type CatalogPageStyleKeys = 'container' | 'flexContainer' | 'search';

type CatalogPageStyle = WithStyles<CatalogPageStyleKeys>;

const styles = () => ({
  container,
  flexContainer,
  search: {
    width: '100%'
  },
}) as StyleRules<CatalogPageStyleKeys>;

class CatalogPage extends React.Component<CatalogPageStyle, CatalogPageState> {
  constructor(props: CatalogPageStyle) {
    super(props);

    this.state = {
      filter: '',
      projects: []
    };
  }

  componentDidMount() {
    fetch(PROJECTS_INFO_URL)
      .then(response => response.json())
      .then(r => {
        this.setState({projects: r});
      });
  }

  handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({filter: event.target.value});
  }

  render() {
    const {classes} = this.props;
    const {filter, projects} = this.state;

    const data = projects.filter(p => p.name.toLowerCase().includes(filter.toLowerCase())).map(p => ({
      key: p.name,
      columns: [
        <Link key={p.name} to={`/demo/${p.name}/diagram`}> {p.name} </Link>,
        p.description
      ]
    }));

    return (
      <div className={classes.container}>
        <div className={classes.flexContainer}>
          <img src={logo} alt="logo"/>
          <RegularCard>
            <TextField
              id="search"
              label="Filter Projects"
              type="search"
              className={classes.search}
              onChange={this.handleFilterChange}
            />
            <MatTable tableHead={['项目', '简介']} tableData={data}/>
          </RegularCard>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)<{}>(CatalogPage);