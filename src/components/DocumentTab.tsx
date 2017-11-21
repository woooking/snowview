import * as React from 'react';
import { LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, withStyles, WithStyles } from 'material-ui';
import { connect } from 'react-redux';
import { Theme } from 'material-ui/styles';
import { DocumentResultState, RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import RankRow from './RankRow';

const styles = (theme: Theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
    table: {
        width: '70%',
    },
    progress: {
        flexGrow: 1,
        margin: theme.spacing.unit * 4
    }
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
    documentResult: state.documentResult,
});

interface DocumentTabProps {
    documentResult: DocumentResultState;
    dispatch: Dispatch<RootState>;
}

type DocumentTabStyle =
    WithStyles<'container' | 'table' | 'progress'>;

class DocumentTab extends React.Component<DocumentTabProps & DocumentTabStyle, {}> {
    
    render() {
        const {classes, documentResult} = this.props;
        return (
            <div className={classes.container}>
                {documentResult.fetching && <LinearProgress className={classes.progress}/>}
                {documentResult.result != null && <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Solr Rank</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documentResult.result.rankedResults.map(r => {
                            return <RankRow
                                key={r.answerId}
                                rank={r.finalRank}
                                title={r.title}
                                solrRank={r.solrRank}
                                detail={r.body}
                                highlight={false}
                            />;
                        })}
                    </TableBody>
                </Table>}
            </div>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(DocumentTab));
