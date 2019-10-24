import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import * as classNames from 'classnames';
import withStyles from 'material-ui/styles/withStyles';
import { Drawer } from 'material-ui';
import { default as List, ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import { AppRoute } from '../../routes/app';
import sidebarStyle, { SidebarStyle } from '../../variables/styles/SidebarStyle';

interface SidebarProps {
  logo: string;
  logoText: string;
  image: string;
  routes: AppRoute[];
}

function activeRoute(routeName: string) {
  const index = window.location.pathname.indexOf(routeName);
  if (index === -1) { return false; }
  if (index + routeName.length === window.location.pathname.length) { return true; }
  return window.location.pathname.charAt(index + routeName.length) === '/';
}

class Sidebar extends React.Component<SidebarProps & SidebarStyle, {}> {

  render() {
    const {classes, logo, logoText, image, routes} = this.props;
    const links = (
      <List className={classes.list}>
        {routes.map((route) => {
          const listItemClasses = classNames({
            [' ' + classes.blue]: activeRoute(route.path)
          });
          const whiteFontClasses = classNames({
            [' ' + classes.whiteFont]: activeRoute(route.path)
          });
          return (
            <NavLink
              to={route.path}
              className={classes.item}
              activeClassName="active"
              key={route.sidebarName}
            >
              <ListItem button={true} className={classes.itemLink + listItemClasses}>
                <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
                  <route.icon />
                </ListItemIcon>
                <ListItemText
                  primary={route.sidebarName}
                  className={classes.itemText + whiteFontClasses}
                  disableTypography={true}
                />
              </ListItem>
            </NavLink>
          );
        })}
      </List>
    );
    const brand = (
      <div className={classes.logo}>
        <Link to="/" className={classes.logoLink}>
          <div className={classes.logoImage}>
            <img src={logo} alt="logo" className={classes.img}/>
          </div>
          {logoText}
        </Link>
      </div>
    );
    return (
      <div>
        <Drawer type="permanent" open={true} classes={{paper: classes.drawerPaper}}>
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          <div
            className={classes.background}
            style={{backgroundImage: `url(${image})`}}
          />
        </Drawer>
      </div>
    );
  }
}

export default withStyles(sidebarStyle)<SidebarProps>(Sidebar);