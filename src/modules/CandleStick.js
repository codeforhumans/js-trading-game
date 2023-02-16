'use strict';

class CandleStick {

    #open
    #close
    #high
    #low
    #volume

    constructor(open, close, high, low, volume) {
        this.#open = open;
        this.#close = close;
        this.#high = high;
        this.#low = low;
        this.#volume = volume;
    }

    static width() {
        return 8;
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

    get volume() {
        return this.#volume;
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