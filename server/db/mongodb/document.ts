import { IDocument } from "../idocument";
import { merge } from "lodash";

export class Document implements IDocument {
    constructor(fields: any) {
        merge(this, fields);
    }

    populate(collection) {

    }
}