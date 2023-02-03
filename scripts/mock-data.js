'use strict';

let interval = 0;

const mockData = [
    {open: 0, close: 20, high: 25, low: -5},
    {open: 20, close: 30, high: 40, low: 10},
    {open: 30, close: 0, high: 50, low: -20},
    {open: 0, close: -20, high: 50, low: -50},
];

setInterval(() => {
    const lastIndex = mockData.length - 1;
    const open = mockData[lastIndex].close;
    const close = Math.random() * 100;
    const high = close + Math.random() * 5;
    const low = open + Math.random() * -5;

    if (interval >= 5) {
        mockData.push({open, close, high, low});
        interval = 0;
        return;
    }

    mockData[lastIndex].close = close;

    if (mockData[lastIndex].high < high) {
        mockData[lastIndex].high = high;
    }

    if (mockData[lastIndex].low > low) {
        mockData[lastIndex].low = low;
    }

    ++interval;
    
}, 1000)