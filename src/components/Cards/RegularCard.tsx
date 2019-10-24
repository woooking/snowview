import * as React from 'react';
import * as classNames from 'classnames';
import withStyles from 'material-ui/styles/withStyles';
import { Card, CardHeader, CardContent, CardActions } from 'material-ui';
import { RegularCardStyle, default as regularCardStyle } from '../../variables/styles/RegularCardStyle';

interface RegularCardProps {
  plainCard?: boolean;
  headerColor?: 'orange' | 'green' | 'red' | 'blue' | 'purple';
  cardTitle?: {};
  cardSubtitle?: {};
  footer?: {};
}

class RegularCard extends React.Component<RegularCardProps & RegularCardStyle, {}> {
  public static defaultProps: Partial<RegularCardProps> = {
    plainCard: false,
    headerColor: 'purple'
  };

  render() {
    const {classes, plainCard, headerColor, cardTitle, cardSubtitle, children, footer} = this.props;

    const plainCardClasses = classNames({
      [' ' + classes.cardPlain]: plainCard
    });
    const cardPlainHeaderClasses = classNames({
      [' ' + classes.cardPlainHeader]: plainCard
    });

    return (
      <Card className={classes.card + plainCardClasses}>
        {cardTitle && <CardHeader
          classes={{
            root: classes.cardHeader + ' ' + classes[headerColor + 'CardHeader'] + cardPlainHeaderClasses,
            title: classes.cardTitle,
            subheader: classes.cardSubtitle
          }}
          title={cardTitle}
          subheader={cardSubtitle}
        />}
        <CardContent>{children}</CardContent>
        {footer !== undefined ? (
          <CardActions className={classes.cardActions}>{footer}</CardActions>
        ) : null}
      </Card>
    );
  }
}

export default withStyles(regularCardStyle)<RegularCardProps>(RegularCard);