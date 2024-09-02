declare module 'redux-mock-store' {
    import { Store, Action } from 'redux';

export type MockStoreCreator<S = any> = (state?: S) => MockStoreEnhanced<S>;

export interface MockStoreEnhanced<S = any> extends Store<S> {
    getActions(): Action[];
    clearActions(): void;
}

export default function configureStore<S = any>(middlewares?: any[]): MockStoreCreator<S>;
}
