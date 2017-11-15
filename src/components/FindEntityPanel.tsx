import * as React from 'react';
import { connect } from 'react-redux';
import {
    Card, CardContent, CardHeader, InputLabel, FormControl, LinearProgress, withStyles,
    WithStyles
} from 'material-ui';
import { Theme } from 'material-ui/styles';
import { NodesState, RelationListsState, RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import { Neo4jD3 } from '../neo4jd3';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';
import { getNodeIDFromRelation, rename } from '../utils';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { FormEvent } from 'react';
import { fetchNode, fetchRelationList, requestShowRelation } from '../redux/action';

const styles = (theme: Theme) => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 240,
    }
});

const mapStateToProps = (state: RootState) => ({
    selectedNode: state.selectedNode,
    nodes: state.nodes,
    relationLists: state.relationLists,
    graph: state.graph.instance
});

interface FindEntityPanelProps {
    selectedNode: number;
    nodes: NodesState;
    relationLists: RelationListsState;
    graph: Neo4jD3;
    dispatch: Dispatch<RootState>;
}

class FindEntityPanel extends React.Component<FindEntityPanelProps & WithStyles<'formControl'>, {}> {
    
    input: HTMLInputElement;
    
    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const catalog = this.input.value;
        const {dispatch, relationLists, selectedNode, nodes, graph} = this.props;
        
        const updateRelations = [];
        const relationList = relationLists[selectedNode].relationList;
        //
        if (relationList.filter(x => !x.shown).filter(x => x.raw.type === catalog).length !== 0) {
            let remain = 5, i = 0;
            while (i < relationList.length && remain > 0) {
                const relation = relationList[i];
                ++i;
                if (relation.shown) {
                    continue;
                }
                if (relation.raw.type !== catalog) {
                    continue;
                }
                dispatch(requestShowRelation({id: selectedNode, relationIndex: i, relation: relation.raw}));
                --remain;
                updateRelations.push(relation);
            }
        }
        
        updateRelations.forEach((relation) => {
            const [startID, endID] = getNodeIDFromRelation(relation.raw);
            const otherID = startID === selectedNode ? endID : startID;
            dispatch(fetchNode(otherID, nodes, graph));
            dispatch(fetchRelationList(otherID, relationLists, graph));
        });
    }
    
    render() {
        let body = null;
        
        const selectedRelationList = this.props.relationLists[this.props.selectedNode];
        
        if (selectedRelationList && selectedRelationList.fetched) {
            const relationTypes = [...new Set(selectedRelationList.relationList.map(x => x.raw.type))];
            body = (
                <form onSubmit={this.handleSubmit}>
                    <FormControl className={this.props.classes.formControl}>
                        <InputLabel htmlFor="relation-type">Relation Type</InputLabel>
                        <Select
                            native={true}
                            input={<Input id="relation-type" inputRef={(input) => this.input = input}/>}
                        >
                            {relationTypes.map(t => <option key={t} value={t}>{rename(t)}</option>)}
                        </Select>
                    </FormControl>
                    <Button type="submit">Submit</Button>
                </form>
            );
        } else {
            body = selectedRelationList ?
                <LinearProgress/> : <Typography component="p"> Please select a node first </Typography>;
            
        }
        return (
            <Card>
                <CardHeader title="Expand Related Entity"/>
                <CardContent>
                    {body}
                </CardContent>
            </Card>
        
        );
    }
}

export default withStyles(styles)

< {}

>
(connect(mapStateToProps)(FindEntityPanel));
