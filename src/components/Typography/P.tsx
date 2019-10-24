import * as React from 'react';
import withStyles from 'material-ui/styles/withStyles';
import typographyStyle, { TypographyStyle } from '../../variables/styles/TypographyStyle';

class P extends React.Component<TypographyStyle, {}> {

  render() {
    const {classes, children} = this.props;

    return (
      <p className={classes.defaultFontStyle + ' ' + classes.pStyle}>
        {children}
      </p>
    );
  }
}

export default withStyles(typographyStyle)<{}>(P);