import * as React from 'react';
import { connect } from 'react-redux';
import {
    Card, CardContent, CardHeader, InputLabel, FormControl, LinearProgress, withStyles,
    WithStyles
} from 'material-ui';
import { Theme } from 'material-ui/styles';
import { RootState } from '../redux/reducer';
import { Dispatch } from 'redux';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { FormEvent } from 'react';
import { Option } from 'ts-option';
import * as _ from 'lodash';
import { fetchNodeWorker, removeNode, showRelations } from '../redux/action';
import { RelationListsState, RelationsState } from '../redux/graphReducer';
import {SnowRelation} from "../model";

const styles = (theme: Theme) => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 240,
    }
});

const mapStateToProps = (state: RootState) => ({
    selectedNode: state.graph.selectedNode,
    relations: state.graph.relations,
    relationLists: state.graph.relationLists,
});

interface FindEntityPanelProps {
    selectedNode: Option<number>;
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
                .filter(x => x.types.some(t => t === catalog))
                .sort((a:SnowRelation,b:SnowRelation)=>(parseInt(a.id)%7-parseInt(b.id)%7))
                .slice(0, 5);

        readyToShow.forEach(r => {
            const source = r.source, target = r.target;
            const otherID = source === selectedNode.get ? target : source;
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
                const relationTypes = _.chain(selectedRelationList.get)
                    .flatMap(x => relations.get(x).types)
                    .uniq()
                    .value();
                body = (
                    <form onSubmit={this.handleSubmit}>
                        <FormControl className={this.props.classes.formControl}>
                            <InputLabel htmlFor="relation-type">Relation Type</InputLabel>
                            <Select
                                native={true}
                                input={<Input id="relation-type" inputRef={(input) => this.input = input}/>}
                            >
                                {relationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </Select>
                        </FormControl>
                        <Button type="submit">EXPAND</Button>
                        <Button onClick={() => dispatch(removeNode(selected))}>HIDE</Button>
                    </form>
                );
            }
        }

        return (
            <Card>
                <CardHeader title="Operations"/>
                <CardContent>
                    {body}
                </CardContent>
            </Card>

        );
    }
}

export default withStyles(styles)<{}>(connect(mapStateToProps)(FindEntityPanel));
