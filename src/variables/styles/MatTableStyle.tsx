import { WithStyles } from 'material-ui';
import { defaultFont, infoColor } from '../styles';
import { StyleRules, Theme } from 'material-ui/styles';

type MatTableStyleKeys = 'tableHeader' | 'table' | 'tableHeadCell' | 'tableRow' | 'tableCell' | 'tableResponsive';

export type MatTableStyle = WithStyles<MatTableStyleKeys>;

const matTableStyle = (theme: Theme) => ({
  tableHeader: {
    color: infoColor
  },
  table: {
    marginBottom: '0',
    width: '100%',
    maxWidth: '100%',
    backgroundColor: 'transparent',
    borderSpacing: '0',
    borderCollapse: 'collapse'
  },
  tableHeadCell: {
    color: 'inherit',
    ...defaultFont,
    fontSize: '1.2em',
    fontWeight: 400
  },
  tableRow: {
    '&:last-child > td': {
      borderBottom: '0'
    }
  },
  tableCell: {
    ...defaultFont,
    lineHeight: '1.42857143',
    padding: '12px 8px',
    verticalAlign: 'middle'
  },
  tableResponsive: {
    width: '100%',
    marginTop: theme.spacing.unit,
    overflowX: 'auto'
  }
}) as StyleRules<MatTableStyleKeys>;

export default matTableStyle;
