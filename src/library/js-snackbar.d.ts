
declare module 'js-snackbar' {
    type ShowOption = {
        text: string;
        pos?: 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left' | 'top-center' | 'top-right';
        duration: number;
    }
    
    export function show(param: ShowOption): void
    
}

