import * as React from 'react';
import { Tooltip, withStyles, WithStyles } from 'material-ui';
import Typography from 'material-ui/Typography';

const styles = () => ({
  statistic: {
    display: 'inline-flex',
    flexDirection: 'column' as 'column',
    width: '100%',
    marginTop: '20px',
    marginBottom: '20px',
  },
  num: {
    fontSize: '1.2rem',
    fontFamily: 'Lato',
    fontWeight: 400 as 400,
    textAlign: 'center',
    lineHeight: '1em',
    color: '#1B1C1D'
  },
  label: {
    fontSize: '0.8em',
    fontFamily: 'Lato',
    fontWeight: 700 as 700,
    whiteSpace: 'nowrap',
    overflow: 'hidden' as 'hidden',
    textTransform: 'uppercase',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    color: 'rgba(0, 0, 0, 0.87)'
  },
});

interface StatisticProps {
  num: number;
  label: string;
}

type RankRowStyle = WithStyles<'statistic' | 'num' | 'label'>;

class Statistic extends React.Component<StatisticProps & RankRowStyle, {}> {
  render() {
    const {num, label, classes} = this.props;
    return (
      <div className={classes.statistic}>
        <Typography className={classes.num}>{num}</Typography>
        <Tooltip title={label} placement="bottom">
          <Typography className={classes.label}>{label}</Typography>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(styles)<StatisticProps>(Statistic);
