import React from 'react';

const DateDisplay = ({ dateString, style }) => {
    // no time situation
    if (!dateString) return null;

    const date = new Date(dateString);

    const formattedDate = date.toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false //using 24 hours
    });

    const defaultStyle = {
        fontSize: '0.75rem',
        opacity: 0.6,
        fontStyle: 'italic',
        marginTop: '4px',
        ...style //enable passing layout to cover default
    };

    return (
        <div className="date-display" style={defaultStyle}>
            {formattedDate}
        </div>
    );
};

export default DateDisplay;