import * as React from 'react';
import { TableCell, TableRow, withStyles, WithStyles } from 'material-ui';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';
import { connect } from 'react-redux';
import { Theme } from 'material-ui/styles';
import { RootState } from '../redux/reducer';

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

const mapStateToProps = (state: RootState) => ({
    // question: state.question,
    // documentResult: state.documentResult,
});

interface RankRowProps {
    rank: number;
    title: string;
    solrRank: number;
    detail: string;
    highlight: boolean;
}

type RankRowStyle =
    WithStyles<'detail' | 'cellRank' | 'cellMain' | 'highlight'>;

class RankRow extends React.Component<RankRowProps & RankRowStyle, {expand: boolean}> {
    state = {
        expand: false
    };
    
    handleExpandMore = () => {
        this.setState({expand: true});
    }
    
    handleExpandLess = () => {
        this.setState({expand: false});
    }
    
    render() {
        const {classes, rank, title, solrRank, detail, highlight} = this.props;
        let delta = (solrRank - rank).toString();
        if (delta[0] !== '-') {
            delta = `+${delta}`;
        }
        const color = solrRank < rank ? 'green' : (solrRank > rank ? 'red' : 'black');
        return (
            <TableRow style={highlight ? {background: '#EEEEEE'} : {}}>
                <TableCell className={classes.cellRank}>
                    {rank}
                    <span style={{color: color}}>{` (${delta})`}</span>
                </TableCell>
                <TableCell className={classes.cellMain}>
                    {title}
                    {!this.state.expand && <ExpandMoreIcon onClick={this.handleExpandMore}/>}
                    {this.state.expand && <ExpandLessIcon onClick={this.handleExpandLess}/>}
                    {this.state.expand && <div className={classes.detail} dangerouslySetInnerHTML={{__html: detail}}/>}
                </TableCell>
                <TableCell className={classes.cellRank}>{solrRank}</TableCell>
            </TableRow>
        );
    }
}

export default withStyles(styles)<RankRowProps>(connect(mapStateToProps)(RankRow));
