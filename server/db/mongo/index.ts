import { IProvider } from "../iprovider";
const Promise = require('bluebird');

export function init(options) {
    return new MongoClient(options);
}

export class MongoClient implements IProvider {

    constructor(private providerInfo) {

    }

    connect() {

    }

    delete(criteria) {

    }

    find(criteria) {

    }

    insert(object) {

    }

    update(criteria) {

    }

    ok() {
        return Promise.resolve(true);
    }
}