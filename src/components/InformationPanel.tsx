import * as React from 'react';
import { connect } from 'react-redux';
import {
    Card, CardContent, CardHeader, LinearProgress, Table, TableBody, TableCell, TableRow, Typography, WithStyles
} from 'material-ui';
import { Theme } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import { Option } from 'ts-option';
import * as _ from 'lodash';
import CodeModal from './CodeModal';
import { RootState } from '../redux/reducer';
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
            body = <Typography component="p"> No entity selected. </Typography>;
        } else {
            const selected = nodes.get(selectedNode.get);
            if (selected.nonEmpty) {
                const node = selected.get.node;
                let properties = Object.keys(node.properties)
                    .map(k => {
                        let content = node.properties[k];
                        if (content.length > 80) {
                            content = (
                                <CodeModal
                                    code={k === 'content' || k === 'comment'}
                                    label="SHOW"
                                    content={content}
                                />
                            );
                        } else {
                            content = <div className={classes.normalCell}>{content.toString()}</div>;
                        }
                        return {key: k, label: k, content};
                    });
                properties = _.sortBy(properties, (entry) => {
                    if (entry.key === 'label') {
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
                <CardHeader title="Read detailed properties"/>
                <CardContent>
                    {body}
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(InformationPanel));
