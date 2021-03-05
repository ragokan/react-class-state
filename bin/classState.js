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
            try {
                const previousState = JSON.stringify(this);
                if (!(typeof setter === "function" && !(yield setter(this)))) {
                    const nextState = typeof setter === "function" ? yield setter(this) : setter;
                    Object.assign(this, nextState);
                }
                if (JSON.stringify(this) !== previousState) {
                    this.subscribers.forEach((sub) => sub(this, JSON.parse(previousState)));
                    this.reRenderState();
                }
            }
            catch (error) {
                console.log(error || "An error happened while changing the state!");
            }
        });
        this.getState = () => {
            return this;
        };
        this.useState = () => {
            try {
                this.initForce();
            }
            catch (error) {
                const errorMessage = "\n An error happened while trying to init the state, it is probably because you are using 'useState' function outside of React function component.";
                console.log(error ? error + errorMessage : errorMessage);
            }
            return this;
        };
        this.subscribeState = (subscriber) => {
            this.subscribers.add(subscriber);
            return () => this.subscribers.delete(subscriber);
        };
        this.initForce = () => {
            const [, force] = react_1.useReducer((c) => c + 1, 0);
            this.force = force;
        };
        this.reRenderState = () => {
            try {
                this.force && this.force();
            }
            catch (error) {
                console.log(error || "An error happened while re-rendering the state!");
            }
        };
    }
}
exports.ClassState = ClassState;
//# sourceMappingURL=classState.js.map