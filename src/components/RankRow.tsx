import * as React from 'react';
import { TableCell, TableRow, withStyles, WithStyles } from 'material-ui';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';
import { Theme } from 'material-ui/styles';

const styles = (theme: Theme) => ({
    detail: {
        borderLeft: '0.25rem',
        borderLeftStyle: 'solid',
        borderLeftColor: theme.palette.secondary[500],
        paddingLeft: theme.spacing.unit
    },
    cellRank: {
        width: '12%'
    },
    cellMain: {
        width: '76%',
        overflowWrap: 'normal',
        whiteSpace: 'normal'
    },
    highlight: {
        background: theme.palette.primary[50]
    }
});

interface RankRowProps {
    id: number;
    rank: number;
    initExpand: boolean;
    title: string;
    detail: string;
}

type RankRowStyle = WithStyles<'detail' | 'cellRank' | 'cellMain' | 'highlight'>;

class RankRow extends React.Component<RankRowProps & RankRowStyle, { expand: boolean }> {
    state = {
        expand: this.props.initExpand
    };

    handleExpandMore = () => {
        this.setState({expand: true});
    }

    handleExpandLess = () => {
        this.setState({expand: false});
    }

    render() {
        const {classes, id, rank, title, detail} = this.props;
        return (
            <TableRow>
                <TableCell className={classes.cellRank}> {rank} </TableCell>
                <TableCell className={classes.cellRank}> {id} </TableCell>
                <TableCell className={classes.cellMain}>
                    {title}
                    {!this.state.expand && <ExpandMoreIcon onClick={this.handleExpandMore}/>}
                    {this.state.expand && <ExpandLessIcon onClick={this.handleExpandLess}/>}
                    {this.state.expand && <div className={classes.detail} dangerouslySetInnerHTML={{__html: detail}}/>}
                </TableCell>
            </TableRow>
        );
    }
}

export default withStyles(styles)<RankRowProps>(RankRow);
