import * as React from 'react';
import { LinearProgress, withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import { DocumentResultState, RootState } from '../../../redux/reducer';
import RankRow from '../../../components/RankRow';
import SearchForm from '../../../components/SearchForm';
import { connect } from 'react-redux';
import { fetchDocumentResultWorker } from '../../../redux/action';
import { DOC_PREDEFINED_QUERIES } from '../../../config';
import { RouteComponentProps } from 'react-router';
import MatTable from '../../../components/MatTable/MatTable';
import { container } from '../../../variables/styles';

const styles = (theme: Theme) => ({
  container: {
    ...container,
  },
  progress: {
    flexGrow: 1,
    margin: theme.spacing.unit * 4
  }
}) as React.CSSProperties;

const mapStateToProps = (state: RootState) => ({
  documentResult: state.documentResult
});

interface DocumentTabRouteProps {
  project: string;
}

interface DocumentTabProps extends RouteComponentProps<DocumentTabRouteProps> {
  documentResult: DocumentResultState;
}

type DocumentTabStyle = WithStyles<'container' | 'progress'>;

class DocumentTab extends React.Component<DocumentTabProps & DocumentTabStyle, {}> {

  render() {
    const {classes, documentResult} = this.props;
    const project = this.props.match.params.project;

    return (
      <div>
        <SearchForm
          query={documentResult.query}
          predefinedQueries={DOC_PREDEFINED_QUERIES}
          callback={(param: { query: string }) => fetchDocumentResultWorker({project, query: param.query})}
        />
        <div className={classes.container}>
          {documentResult.fetching && <LinearProgress className={classes.progress}/>}
          {documentResult.result != null &&
          <MatTable
            tableHead={['Rank', 'ID', 'Answer']}
            tableData={documentResult.result.map(r => ({
              columns: [`${r.rank}`, `${r.id}`, <RankRow
                key={r.id}
                initExpand={r.rank === 1}
                title={'['  + r.label + '] ' + (r.properties.title == null ? "" : r.properties.title)}
                detail={r.properties.html}
              />]
            }))}
          />}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(DocumentTab));
