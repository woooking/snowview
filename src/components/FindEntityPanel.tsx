import * as React from 'react';
import { connect } from 'react-redux';
import {
    Card, CardContent, CardHeader, InputLabel, FormControl, LinearProgress, withStyles,
    WithStyles
} from 'material-ui';
import { Theme } from 'material-ui/styles';
import { NodesState, RelationListsState, RelationsState, RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';
import { getNodeIDFromRelation, rename } from '../utils';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { FormEvent } from 'react';
import { Option } from 'ts-option';
import * as _ from 'lodash';
import { fetchNodeWorker, removeNode, showRelations } from '../redux/action';

const styles = (theme: Theme) => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 240,
    }
});

const mapStateToProps = (state: RootState) => ({
    selectedNode: state.graph.selectedNode,
    nodes: state.graph.nodes,
    relations: state.graph.relations,
    relationLists: state.graph.relationLists,
});

interface FindEntityPanelProps {
    selectedNode: Option<number>;
    nodes: NodesState;
    relations: RelationsState;
    relationLists: RelationListsState;
    dispatch: Dispatch<RootState>;
}

class FindEntityPanel extends React.Component<FindEntityPanelProps & WithStyles<'formControl'>, {}> {
    
    input: HTMLInputElement;
    
    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const catalog = this.input.value;
        const {dispatch, selectedNode, relationLists, relations} = this.props;

        const relationList = relationLists.get(selectedNode.get);
        
        const readyToShow =
            relationList.get
                .map(x => relations.get(x))
                .filter(x => !x.shown)
                .filter(x => x.relation.type === catalog)
                .map(x => x.relation)
                .slice(0, 5);
    
        readyToShow.forEach(r => {
            const [startID, endID] = getNodeIDFromRelation(r);
            const otherID = startID === selectedNode.get ? endID : startID;
            dispatch(fetchNodeWorker(otherID));
        });
        
        dispatch(showRelations(readyToShow.map(x => x.id)));
    }

    render() {
        let body = null;

        const {dispatch, selectedNode, relationLists, relations} = this.props;

        if (selectedNode.isEmpty) {
            body = <Typography component="p"> Please select a node first </Typography>;
        } else {
            const selected = selectedNode.get;
            const selectedRelationList = relationLists.get(selected);
            
            if (selectedRelationList.isEmpty) {
                body = <LinearProgress/>;
            } else {
                const relationTypes = _.uniq(selectedRelationList.get.map(x => relations.get(x).relation.type));
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
                        <Button onClick={() => dispatch(removeNode(selected))}>Remove</Button>
                    </form>
                );
            }
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

export default withStyles(styles)<{}>(connect(mapStateToProps)(FindEntityPanel));
