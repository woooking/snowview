import * as React from 'react';
import { withStyles } from 'material-ui';

import footerStyle, { FooterStyle } from '../../variables/styles/FooterStyle';

class Footer extends React.Component<FooterStyle, {}> {
  render() {
    const {classes} = this.props;
    return (
      <footer className={classes.footer}>
        <div className={classes.container}>
          <p className={classes.right}>
          <span>
            Copyright 2018, Software Engineering Institute, Peking University. All right reserved.
          </span>
          </p>
        </div>
      </footer>
    );
  }
}

export default withStyles(footerStyle)<{}>(Footer);