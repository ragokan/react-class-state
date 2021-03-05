"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyClassState = void 0;
const classState_1 = require("./classState");
const LazyClassState = (initialState) => {
    class LazyClass extends classState_1.ClassState {
        constructor() {
            super();
            Object.assign(this, initialState || {});
        }
    }
    const lazyClass = Object.assign(new LazyClass());
    return lazyClass;
};
exports.LazyClassState = LazyClassState;
//# sourceMappingURL=lazyClass.js.map