import * as React from 'react';
import logo from '../assets/img/logo.jpg';
import Table from 'material-ui/Table';
import { TableHead, TableRow, TableCell, TableBody, TextField, WithStyles } from 'material-ui';
import { Theme, withStyles } from 'material-ui/styles';
import { StyleRules } from 'material-ui/styles/withStyles';
import { ChangeEvent } from 'react';
import { ProjectInfo } from '../model';
import { PROJECTS_INFO_URL } from '../config';
import { Link } from 'react-router-dom';

interface IndexPageState {
    filter: string;
    projects: ProjectInfo[];
}

type IndexPageStyleKeys = 'container' | 'search' | 'table';

type IndexPageStyle = WithStyles<IndexPageStyleKeys>;

const styles = (theme: Theme) => ({
    container: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    search: {
        width: '70%'
    },
    table: {
        width: '70%'
    }
}) as StyleRules<IndexPageStyleKeys>;

class IndexPage extends React.Component<IndexPageStyle, IndexPageState> {
    state: IndexPageState = {
        filter: '',
        projects: []
    };

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

        return (
            <div className={classes.container}>
                <img src={logo} alt="logo"/>
                <TextField
                    id="search"
                    label="Filter Projects"
                    type="search"
                    className={classes.search}
                    onChange={this.handleFilterChange}
                />
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>项目</TableCell>
                            <TableCell>简介</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.filter(p => p.name.includes(filter)).map(p =>
                            <TableRow key={p.name}>
                                <TableCell>
                                    <Link to={`/${p.name}`}> {p.name} </Link>
                                </TableCell>
                                <TableCell>{p.description}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default withStyles(styles)<{}>(IndexPage);