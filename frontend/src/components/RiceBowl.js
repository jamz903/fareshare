import React from 'react';
import RiceBowlSVG from '../assets/ricebowl.svg';

export default function RiceBowl({ width, height, className = '' }) {
    const styling = `w-${width} h-${height} drop-shadow rounded-full object-cover ${className}`

    return (
        <img src={RiceBowlSVG} className={styling} alt="ricebowl logo" />
    );
}