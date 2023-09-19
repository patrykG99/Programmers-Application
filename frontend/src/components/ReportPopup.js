import React from 'react';
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { createPopper } from '@popperjs/core';
import { useRef } from 'react'

function ReportPopup({ isOpen, onClose, onSubmit, buttonRef, reportReason, setReportReason }) {
    const popupRef = useRef(null);

    useEffect(() => {
        let popperInstance = null;

        if (isOpen && buttonRef.current && popupRef.current) {
            popperInstance = createPopper(buttonRef.current, popupRef.current, {
                placement: 'right',
            });
        }

        return () => {
            if (popperInstance) {
                popperInstance.destroy();
                popperInstance = null;
            }
        };
    }, [isOpen, buttonRef]);

    if (!isOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div ref={popupRef} className="report-popup">
            <label>
                Reason:
                <input type="text" value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
            </label>
            <button onClick={onSubmit}>Submit</button>
            <button onClick={onClose}>Cancel</button>
        </div>,
        document.body
    );
}

export default ReportPopup;