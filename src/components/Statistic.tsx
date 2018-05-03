import * as React from 'react';
import { withStyles, WithStyles } from 'material-ui';
import { Theme } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = (theme: Theme) => ({
    statistic: {
        display: 'inline-flex',
        flexDirection: 'column' as 'column',
        marginTop: '20px',
        marginBottom: '20px',
    },
    num: {
        fontSize: '3rem',
        fontFamily: 'Lato',
        fontWeight: 400 as 400,
        textAlign: 'center',
        lineHeight: '1em',
        color: '#1B1C1D'
    },
    label: {
        fontSize: '1em',
        fontFamily: 'Lato',
        fontWeight: 700 as 700,
        textTransform: 'uppercase',
        textAlign: 'center',
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
                <Typography className={classes.label}>{label}</Typography>
            </div>
        );
    }
}

export default withStyles(styles)<StatisticProps>(Statistic);
