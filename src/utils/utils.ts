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

const I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');

function hash0(input: string): string {
    let hash = 5381;
    let i = input.length - 1;

    for (; i > -1; i--) {
        hash += (hash << 5) + input.charCodeAt(i);
    }
    let value = hash & 0x7FFFFFFF;

    let retValue = '';
    do {
        retValue += I64BIT_TABLE[value & 0x3F];
    }
    while (value >>= 6);

    return retValue;
}

export function colorHash(s: string): number {
    s = hash0(s);
    let h = 0;
    for (let i = 0; i < s.length; ++i) {
        const chr = s.charCodeAt(i);
        h = h * 79 + chr;
    }
    return h;
}

export function name2color(name: string): string {
	if (name=='Class') return '#43CD80';
	if (name=='Method') return '#9AFF9A';
	if (name=='Field') return '#C1FFC1';
	if (name=='GitUser') return '#D3D3D3';
	if (name=='Commit') return '#708090';
	if (name=='Docx') return '#4169E1';
    const h = colorHash(name) % 360;
    return Math.ceil(h / 30) % 2 === 0 ?
        hsl(h, 1, 0.8).rgb().toString() :
        hsl(h, 1, 0.6).rgb().toString();
}