'use strict';

class CandleStick {

    #open
    #close
    #high
    #low

    constructor(open, close, high, low) {
        this.#open = open;
        this.#close = close;
        this.#high = high;
        this.#low = low;
    }

    static width() {
        return 5;
    }

    get open() {
        return this.#open
    }

    get close() {
        return this.#close;
    }

    get high() {
        return this.#high;
    }

    get low() {
        return this.#low;
    }

    isBear() {
        return this.#open > this.#close;
    }

    highLowWidth() {
        return 1;
    }

    height() {
        return this.isBear()
            ? this.#open - this.#close
            : this.#close - this.#open;
    }

    highLowHeight() {
        return this.#high - this.#low;
    }
}

export default CandleStick;