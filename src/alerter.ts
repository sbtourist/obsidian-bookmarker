import * as ToastMaker from 'toastmaker';
import "toastmaker/dist/toastmaker.css";

export function success(text: string) {
    ToastMaker(text, 3000, {
        valign: 'top',
        align: 'right',
        styles: { 
            backgroundColor: 'green',
            fontSize: '14px',
        }
    });
}

export function warn(text: string) {
    ToastMaker(text, 3000, {
        valign: 'top',
        align: 'right',
        styles: { 
            backgroundColor: 'red',
            fontSize: '14px',
        }
    });
}