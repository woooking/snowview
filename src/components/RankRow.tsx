import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';
import { Theme } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = (theme: Theme) => ({
  detail: {
    borderWidth: '0.25px',
    borderStyle: 'solid',
    borderColor: '0x7F7F7F',
    padding: '8px',
    margin: '8px',
  },
  cellRank: {
    width: '12%'
  },
  cellMain: {
    width: '76%',
    borderBottom: 'none',
    overflowWrap: 'normal',
    whiteSpace: 'normal'
  },
  cellTitle: {
    fontSize: 16,
    color: '#3f51b5',
    fontWeight: 'bold' as 'bold',
    display: 'inline',
  },
  highlight: {
    background: theme.palette.primary[50]
  }
});

interface RankRowProps {
  initExpand: boolean;
  title: string;
  detail: string;
}

type RankRowStyle = WithStyles<'detail' | 'cellRank' | 'cellMain' | 'cellTitle' | 'highlight'>;

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
    const {classes, title, detail} = this.props;
    return (
      <div className={classes.cellMain}>
        <Typography className={classes.cellTitle}>{`${title}`}</Typography>
        {!this.state.expand && <ExpandMoreIcon onClick={this.handleExpandMore}/>}
        {this.state.expand && <ExpandLessIcon onClick={this.handleExpandLess}/>}
        {this.state.expand && <div className={classes.detail} dangerouslySetInnerHTML={{__html: detail}}/>}
      </div>
    );
  }
}

export default withStyles(styles)<RankRowProps>(RankRow);
