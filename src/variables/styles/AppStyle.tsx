import { WithStyles } from 'material-ui';
import { drawerWidth, footerHeight, transition } from '../styles';
import { StyleRules } from 'material-ui/styles';

type AppStyleKeys = 'mainPanel' | 'content';

export type AppStyle = WithStyles<AppStyleKeys>;

const appStyle = () => ({
  mainPanel: {
    width: `calc(100% - ${drawerWidth}px)`,
    overflow: 'auto',
    position: 'relative',
    float: 'right',
    ...transition,
    maxHeight: '100%',
    overflowScrolling: 'touch'
  },
  content: {
    minHeight: `calc(100vh - ${footerHeight}px)`
  },
}) as StyleRules<AppStyleKeys>;

export default appStyle;
