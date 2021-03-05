declare type StateSubscriber<T = Object> = (currentState: T, previousState: T) => void;
declare type Hide<T> = Pick<T, Exclude<keyof T, "useState" | "getState" | "setState" | "subscribeState">>;
declare type HideGet<T> = Pick<T, Exclude<keyof T, "getState">>;
declare type HideUse<T> = Pick<T, Exclude<keyof T, "useState">>;
export declare class ClassState {
    private force;
    private subscribers;
    setState: (setter: Partial<Hide<this>> | ((currentState: Hide<this>) => Partial<Hide<this>>) | ((state: Hide<this>) => void)) => Promise<void>;
    getState: () => HideGet<this>;
    useState: () => HideUse<this>;
    subscribeState: (subscriber: StateSubscriber<this>) => () => boolean;
    private initForce;
    private reRenderState;
}
export {};
