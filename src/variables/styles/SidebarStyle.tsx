import { WithStyles } from 'material-ui';
import { boxShadow, defaultFont, drawerWidth, infoColor } from '../styles';
import { StyleRules, Theme } from 'material-ui/styles';

type SidebarStyleKeys = 'drawerPaper' |
  'logo' |
  'logoLink' |
  'logoImage' |
  'img' |
  'background' |
  'list' |
  'item' |
  'itemLink' |
  'itemIcon' |
  'itemText' |
  'whiteFont' |
  'blue' |
  'sidebarWrapper';

export type SidebarStyle = WithStyles<SidebarStyleKeys>;

const sidebarStyle = (theme: Theme) => ({
  drawerPaper: {
    border: 'none',
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    zIndex: 1,
    ...boxShadow,
    width: drawerWidth,
    height: '100%',
  },
  logo: {
    position: 'relative',
    padding: '15px 15px',
    zIndex: 4,
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '0',

      height: '1px',
      right: '15px',
      width: 'calc(100% - 30px)',
      backgroundColor: 'rgba(180, 180, 180, 0.3)'
    }
  },
  logoLink: {
    ...defaultFont,
    textTransform: 'uppercase',
    padding: '5px 0',
    display: 'block',
    fontSize: '18px',
    textAlign: 'left',
    fontWeight: 400,
    lineHeight: '30px',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    '&,&:hover': {
      color: '#FFFFFF'
    }
  },
  logoImage: {
    width: '30px',
    display: 'inline-block',
    maxHeight: '30px',
    marginLeft: '10px',
    marginRight: '15px'
  },
  img: {
    width: '140px',
    top: '22px',
    position: 'absolute',
    verticalAlign: 'middle',
    border: '0'
  },
  background: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: '100%',
    display: 'block',
    top: '0',
    left: '0',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    '&:after': {
      position: 'absolute',
      zIndex: 3,
      width: '100%',
      height: '100%',
      content: '""',
      display: 'block',
      background: '#000',
      opacity: '.8'
    }
  },
  list: {
    marginTop: '20px',
    paddingLeft: '0',
    paddingTop: '0',
    paddingBottom: '0',
    marginBottom: '0',
    listStyle: 'none'
  },
  item: {
    position: 'relative',
    display: 'block',
    textDecoration: 'none',
  },
  itemLink: {
    width: 'auto',
    transition: 'all 300ms linear',
    margin: '10px 15px 0',
    borderRadius: '3px',
    position: 'relative',
    display: 'block',
    padding: '10px 15px',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(200, 200, 200, 0.2)'
    },
    ...defaultFont
  },
  itemIcon: {
    width: '24px',
    height: '30px',
    float: 'left',
    marginRight: '15px',
    textAlign: 'center',
    verticalAlign: 'middle',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  itemText: {
    ...defaultFont,
    margin: '0',
    lineHeight: '30px',
    fontSize: '14px',
    color: '#FFFFFF'
  },

  whiteFont: {
    color: '#FFFFFF'
  },
  blue: {
    backgroundColor: infoColor,
    boxShadow:
      '0 12px 20px -10px rgba(0,188,212,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,188,212,.2)',
    '&:hover': {
      backgroundColor: infoColor,
      boxShadow:
        '0 12px 20px -10px rgba(0,188,212,.28), 0 4px 20px 0 rgba(0,0,0,.12), 0 7px 8px -5px rgba(0,188,212,.2)'
    }
  },
  sidebarWrapper: {
    position: 'relative',
    height: 'calc(100vh - 75px)',
    overflow: 'auto',
    width: drawerWidth,
    zIndex: 4,
    overflowScrolling: 'touch'
  }
}) as StyleRules<SidebarStyleKeys>;

export default sidebarStyle;
