import { WithStyles } from 'material-ui';
import {
  blueCardHeader, card, cardHeader, defaultFont, greenCardHeader, orangeCardHeader, purpleCardHeader,
  redCardHeader
} from '../styles';
import { StyleRules } from 'material-ui/styles';

type RegularCardStyleKeys = 'card' |
  'cardPlain' |
  'cardHeader' |
  'cardPlainHeader' |
  'orangeCardHeader' |
  'greenCardHeader' |
  'redCardHeader' |
  'blueCardHeader' |
  'purpleCardHeader' |
  'cardTitle' |
  'cardSubtitle' |
  'cardActions';

export type RegularCardStyle = WithStyles<RegularCardStyleKeys>;

const regularCardStyle = () => ({
  card,
  cardPlain: {
    background: 'transparent',
    boxShadow: 'none'
  },
  cardHeader: {
    // display: 'inline-block',
    // width: '200px',
    ...cardHeader,
    ...defaultFont
  },
  cardPlainHeader: {
    marginLeft: 0,
    marginRight: 0
  },
  orangeCardHeader,
  greenCardHeader,
  redCardHeader,
  blueCardHeader,
  purpleCardHeader,
  cardTitle: {
    color: '#FFFFFF',
    marginTop: '0',
    marginBottom: '5px',
    ...defaultFont,
    fontSize: '1.125em'
  },
  cardSubtitle: {
    ...defaultFont,
    marginBottom: '0',
    color: 'rgba(255, 255, 255, 0.62)',
    margin: '0 0 10px'
  },
  cardActions: {
    padding: '14px',
    display: 'block',
    height: 'auto'
  }
}) as StyleRules<RegularCardStyleKeys>;

export default regularCardStyle;
