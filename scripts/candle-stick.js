'use strict';

class CandleStick {

    constructor(open, close, high, low) {
        this.open = open;
        this.close = close;
        this.high = high;
        this.low = low;
    }

    isBear() {
        return this.open > this.close;
    }

    static width() {
        return 5;
    }

    highLowWidth() {
        return 1;
    }

    height() {
        return this.isBear()
            ? this.open - this.close
            : this.close - this.open;
    }

    highLowHeight() {
        return this.high - this.low;
    }
}