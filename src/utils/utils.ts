import { show } from 'js-snackbar';

export function showError(message: string) {
    show({
        text: message,
        pos: 'bottom-center',
        duration: 1000
    });
}

export function withError<V>(message: string, value: V): V {
    showError(message);
    return value;
}