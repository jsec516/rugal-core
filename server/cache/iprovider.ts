export interface IProvider {
    get(key: string);
    set(key: string, value: any);
}