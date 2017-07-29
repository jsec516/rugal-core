export interface IProvider {
    find(criteria: any);
    insert(criteria: any);
    update(criteria: any);
}