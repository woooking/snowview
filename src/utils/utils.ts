import { show } from 'js-snackbar';
import { hsl } from 'd3-color';

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

export function hash(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; ++i) {
        const chr = s.charCodeAt(i);
        h = h * 31 + chr;
    }
    return h;
}

export function name2color(name: string): string {
    const h = hash(name) % 360;
    return Math.ceil(h / 48) % 2 === 0 ?
        hsl(h, 1, 0.5).rgb().toString() :
        hsl(h, 1, 0.75).rgb().toString();
}