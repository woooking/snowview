import * as React from 'react';
import { connect } from 'react-redux';
import {
    Card, CardContent, CardHeader, LinearProgress,
    Table, TableBody, TableCell, TableRow, Typography, WithStyles
} from 'material-ui';
import CodeModal from './CodeModal';
import { NodesState, RootState } from '../redux/reducer';
import { Theme } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import { Option } from 'ts-option';

const codePropertyCnName = {
    'name': '名称', 'fullName': '全名', 'access': '访问修饰符', 'superClass': '父类', 'implements': '实现接口',
    'extends': '父接口', 'isAbstract': '是否抽象类(abstract)', 'isFinal': '是否不可变(final)',
    'isStatic': '是否静态', 'belongTo': '所属类', 'comment': '注释', 'content': '内容'
};

const docPropertyCnName = {
    'sectionTitle': '标题', 'sectionContent': '内容', 'tableContent': '表格内容',
    'docxName': '文档名称', 'projectName': '项目名称', 'plainTextContent': '文本内容'
};

const propertyCnName = Object.assign({}, codePropertyCnName, docPropertyCnName);

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
                const properties = Object.keys(propertyCnName)
                    .filter(x => selected.get.hasOwnProperty(x))
                    .map(x => {
                        let content = selected.get[x];
                        content = (x === 'content' || x === 'comment') ?
                            <CodeModal code={true} label="SHOW" content={content} contrast={false}/> :
                            <div className={classes.normalCell}>{content.toString()}</div>;
                        return {key: x, label: x, content};
                    });
                const label = selected.get._labels[0];
                body = (
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Type: </TableCell>
                                <TableCell>{`${label}`}</TableCell>
                            </TableRow>
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
