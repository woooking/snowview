import * as React from 'react';
import withStyles from 'material-ui/styles/withStyles';
import { Table, TableHead, TableRow, TableCell, TableBody } from 'material-ui';
import matTableStyle, { MatTableStyle } from '../../variables/styles/MatTableStyle';

type CellElement = string | JSX.Element;
type Row = {
  key?: string;
  columns: CellElement[];
};

interface MatTableProps {
  tableHead?: string[];
  tableData: Row[];
}

class MatTable extends React.Component<MatTableProps & MatTableStyle, {}> {

  render() {
    const {classes, tableHead, tableData} = this.props;

    return (
      <div className={classes.tableResponsive}>
        <Table className={classes.table}>
          {tableHead !== undefined ? (
            <TableHead className={classes.tableHeader}>
              <TableRow>
                {tableHead.map((prop, key) => (
                  <TableCell
                    className={classes.tableCell + ' ' + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          ) : null}
          <TableBody>
            {tableData.map((row, k1) =>
              <TableRow className={classes.tableRow} key={row.key || k1}>
                {row.columns.map((prop, k2) => (
                  <TableCell className={classes.tableCell} key={k2}> {prop} </TableCell>
                ))}
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withStyles(matTableStyle)<MatTableProps>(MatTable);