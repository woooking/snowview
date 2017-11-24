import { translation } from './translation';
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

export function rename(str: string) {
    if (translation.relationships[str] && translation.relationships[str].englishName) {
        return translation.relationships[str].englishName;
    }
    if (translation.in_relationships[str] && translation.in_relationships[str].englishName) {
        return translation.in_relationships[str].englishName;
    }
    if (translation.ou_relationships[str] && translation.ou_relationships[str].englishName) {
        return translation.ou_relationships[str].englishName;
    }
    if (str.substring(0, 3) === 'in_') { return str.substring(3) + '(incoming)'; }
    if (str.substring(0, 3) === 'ou_') { return str.substring(3) + '(outgoing)'; }
    return str;
}
