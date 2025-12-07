import React from 'react';
import jetstay from './jetstay.jpeg'; // Adjust path as needed

function JetStayIcon() {
    return (
        <svg width="1280" height="853" viewBox="0 0 1280 853" fill="none">
            <rect width="1280" height="853" fill="url(#pattern0_0_2)" />
            <defs>
                <pattern id="pattern0_0_2" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use href="#image0_0_2" transform="scale(0.00078125 0.00117233)" />
                </pattern>
                <image
                    id="image0_0_2"
                    width="1400"
                    height="900"

                    href={jetstay}
                />
            </defs>
        </svg>
    );
}

export default JetStayIcon;