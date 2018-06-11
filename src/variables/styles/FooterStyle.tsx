import { defaultFont, container } from '../styles';
import { WithStyles } from 'material-ui';
import { StyleRules } from 'material-ui/styles';

type FooterStyleKeys = 'right' | 'footer' | 'container';

export type FooterStyle = WithStyles<FooterStyleKeys>;

const footerStyle = {
  right: {
    padding: '15px 0',
    margin: '0',
    fontSize: '14px',
    float: 'right!important'
  },
  footer: {
    bottom: '0',
    borderTop: '1px solid #e7e7e7',
    padding: '15px 0',
    ...defaultFont
  },
  container,
} as StyleRules<FooterStyleKeys>;

export default footerStyle;
