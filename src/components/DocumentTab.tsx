import * as React from 'react';
import { LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import { DocumentResultState } from '../redux/reducer';
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

interface DocumentTabProps {
    documentResult: DocumentResultState;
}

type DocumentTabStyle = WithStyles<'container' | 'table' | 'progress'>;

class DocumentTab extends React.Component<DocumentTabProps & DocumentTabStyle, {}> {

    render() {
        const {classes, documentResult} = this.props;
        return (
            <div className={classes.container}>
                {documentResult.fetching && <LinearProgress className={classes.progress}/>}
                {documentResult.result != null && <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ranking</TableCell>
                            <TableCell>Candidate Answer</TableCell>
                            <TableCell>Up/Down(w.r.t. IR)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documentResult.result.rankedResults
                            .filter(r => r.finalRank <= 20)
                            .map(r => <RankRow
                                key={r.finalRank}
                                rank={r.finalRank}
                                title={r.title}
                                solrRank={r.solrRank}
                                detail={r.body}
                                highlight={r.highlight}
                            />)}
                    </TableBody>
                </Table>}
            </div>
        );
    }
}

export default withStyles(styles)<DocumentTabProps>(DocumentTab);
