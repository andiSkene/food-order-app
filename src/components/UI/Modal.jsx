import { createPortal } from "react-dom";
import { useEffect, useRef } from 'react';

export default function Modal({ children, open, onClose, modalClassName = '' }) {
    const dialog = useRef();

    useEffect(() => {
        const modal = dialog.current;
        if(open) {
            modal.showModal();
        }

        //cleanup function
        return () => modal.close();
    }, [open]);

    return createPortal(
        <dialog ref={dialog} className={`modal ${modalClassName}`} onClose={onClose}>{children}</dialog>,
        document.getElementById('modal')
    )
}