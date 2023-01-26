'use strict';

const mockData = [
    {open: 0, close: 20, high: 25, low: -5},
    {open: 20, close: 30, high: 40, low: 10},
    {open: 30, close: 0, high: 50, low: -20},
    {open: 0, close: -20, high: 50, low: -50},
];

setInterval(() => {
    const lastClose = mockData[mockData.length - 1].close;
    const newClose = Math.random() * 100;
    
    mockData.push({
        open: lastClose,
        close: newClose,
        high: newClose + Math.random() * 10,
        low: lastClose + Math.random() * -10
    });
}, 100)