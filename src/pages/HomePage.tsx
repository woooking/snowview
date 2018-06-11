import * as React from 'react';
import logo from '../assets/img/logo.png';
import { WithStyles, Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import { StyleRules } from 'material-ui/styles/withStyles';
import { container, flexContainer, primaryColor } from '../variables/styles';

type HomePageStyleKeys = 'container' | 'flexContainer' | 'logoTitle';

type HomePageStyle = WithStyles<HomePageStyleKeys>;

const styles = () => ({
  container,
  flexContainer,
  logoTitle: {
    position: 'relative',
    width: '300px',
    left: '18px',
    top: '18px'
  }
}) as StyleRules<HomePageStyleKeys>;

const emph = (text: string) => (
  <span style={{color: primaryColor}}>{text}</span>
);

class HomePage extends React.Component<HomePageStyle, {}> {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.flexContainer}>
          <h1 style={{display: 'inline'}}>
            What is
            <img className={classes.logoTitle} src={logo} alt="SnowGraph"/>
          </h1>
          <Typography component="h2" type="headline">
            SnowGraph ({emph('S')}oftware k{emph('NOW')}ledge {emph('Graph')})
            helps programmers learn how to reuse open source software
            projects.
          </Typography>
          <ul>
            <li>
              It automatically extracts domain-specific knowledge graphs from the clutter of heterogeneous
              software resources (e.g. source code, user tutorial, commit history, mailing lists, issue
              reports and forum discussions).
            </li>
            <li>
              It provides intelligent question answering services for programmers to query these software
              knowledge graphs.
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)<{}>(HomePage);