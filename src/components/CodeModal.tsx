import * as React from 'react';
import { Dialog, withStyles, Button, WithStyles } from 'material-ui';
import * as Prism from 'prismjs';
import { Theme } from 'material-ui/styles';

const styles = (theme: Theme) => ({
    container: {
        margin: theme.spacing.unit * 2,
        overflow: 'auto',
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap',
    },
    button: {
        display: 'inline',
    }
}) as React.CSSProperties;

interface CodeModalProps {
    content: string;
    contrast: boolean;
    label: string;
    code: boolean;
}

type CodeModalStyle = WithStyles<'container' | 'button'>;

class CodeModal extends React.Component<CodeModalProps & CodeModalStyle, { open: boolean }> {
    state = {
        open: false
    };

    handleClickOpen = () => {
        this.setState({open: true});
    }

    handleRequestClose = () => {
        this.setState({open: false});
    }

    render() {
        const {classes} = this.props;

        const content =
            this.props.code ? Prism.highlight(this.props.content, Prism.languages.javascript) : this.props.content;

        return (
            <span>
                <Button
                    className={classes.button}
                    color={this.props.contrast ? 'contrast' : 'default'}
                    onClick={this.handleClickOpen}
                >
                    {this.props.label}
                </Button>
                <Dialog fullWidth={true} maxWidth="md" onRequestClose={this.handleRequestClose} open={this.state.open}>
                    <pre className={classes.container} dangerouslySetInnerHTML={{__html: content}}/>
                </Dialog>
            </span>
        );
    }
}

export default withStyles(styles)<CodeModalProps>(CodeModal);
