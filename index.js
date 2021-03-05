"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassState = void 0;
const react_1 = require("react");
class ClassState {
    constructor() {
        this.subscribers = new Set();
        this.setState = (setter) => __awaiter(this, void 0, void 0, function* () {
            let nextState;
            const previousState = Object.assign({}, this);
            if (!(typeof setter === "function" && !(yield setter(this)))) {
                nextState = typeof setter === "function" ? yield setter(this) : setter;
                Object.assign(this, nextState);
            }
            this.subscribers.forEach((sub) => sub(this, previousState));
            this.reRenderState();
        });
        this.getState = () => {
            return this;
        };
        this.useState = () => {
            this.initForce();
            return this;
        };
        this.subscribeState = (subscriber) => {
            this.subscribers.add(subscriber);
            return subscriber;
        };
        this.initForce = () => {
            const [, force] = react_1.useReducer((c) => c + 1, 0);
            this.force = force;
        };
        this.reRenderState = () => {
            this.force && this.force();
        };
    }
}
exports.ClassState = ClassState;
exports.default = ClassState;
//# sourceMappingURL=index.js.map