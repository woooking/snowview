import * as React from 'react';
import { connect } from 'react-redux';
import {
    Card, CardContent, CardHeader, LinearProgress,
    Table, TableBody, TableCell, TableRow, Typography, WithStyles
} from 'material-ui';
import CodeModal from './CodeModal';
import { RootState } from '../redux/reducer';
import { Theme } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import { Option } from 'ts-option';
import * as _ from 'lodash';
import { NodesState } from '../redux/graphReducer';

const mapStateToProps = (state: RootState) => {
    return {
        selectedNode: state.graph.selectedNode,
        nodes: state.graph.nodes
    };
};

const styles = (theme: Theme) => ({
    normalCell: {
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    }
});

interface InformationPanelProps {
    selectedNode: Option<number>;
    nodes: NodesState;
}

class InformationPanel extends React.Component<InformationPanelProps & WithStyles<'normalCell'>, {}> {
    render() {
        let body = null;

        const {classes, selectedNode, nodes} = this.props;

        if (selectedNode.isEmpty) {
            body = <Typography component="p"> Please select a node first </Typography>;
        } else {
            const selected = nodes.get(selectedNode.get);
            if (selected.nonEmpty) {
                const node = selected.get.node;
                let properties = Object.keys(node)
                    .map(k => {
                        let content = node[k];
                        if (k === 'content' || k === 'comment') {
                            content = <CodeModal code={true} label="SHOW" content={content} contrast={false}/>;
                        } else {
                            if (content.length > 80) {
                                content = content.substr(0, 80) + '...';
                            }
                            content = <div className={classes.normalCell}>{content.toString()}</div>;
                        }
                        return {key: k, label: k, content};
                    });
                properties = _.sortBy(properties, (entry) => {
                    if (entry.key === '_labels') {
                        return 1;
                    }
                    if (entry.key.indexOf('name') !== -1) {
                        return 2;
                    }
                    if (entry.key.indexOf('signature') !== -1) {
                        return 3;
                    }
                    if (entry.key.indexOf('title') !== -1) {
                        return 4;
                    }
                    return 10;
                });
                body = (
                    <Table>
                        <TableBody>
                            {properties.map(p => <TableRow key={p.key}>
                                <TableCell>{p.label}</TableCell>
                                <TableCell>{p.content}</TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                );
            } else {
                body = <LinearProgress/>;
            }
        }

        return (
            <Card>
                <CardHeader title="Entity Properties"/>
                <CardContent>
                    {body}
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(InformationPanel));
