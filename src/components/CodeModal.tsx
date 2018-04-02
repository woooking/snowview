import * as React from 'react';
import { Dialog, withStyles, WithStyles, Typography } from 'material-ui';
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
        const {classes, code, content, label} = this.props;

        const c = code ? Prism.highlight(content, Prism.languages.javascript) : content;

        return (
            <span>
                <Typography component="a" {...{href: '#', onClick: this.handleClickOpen}}>
                    {label}
                </Typography>
                <Dialog fullWidth={true} maxWidth="md"  onRequestClose={this.handleRequestClose} open={this.state.open}>
                    <pre className={classes.container} dangerouslySetInnerHTML={{__html: c}}/>
                </Dialog>
            </span>
        );
    }
}

export default withStyles(styles)<CodeModalProps>(CodeModal);
