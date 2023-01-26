'use strict';

class Order {

    constructor(type, initPos, endPos) {
        this.type = type;
        this.init = initPos;
        this.end = endPos;
    }

    isOpen() {
        return !! this.end;
    }
}