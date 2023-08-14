import { BaseDataStore } from "../BaseDataStore.js";
import { DataSchema, Type } from "../DataSchema.js";
import { Query, Patch, Create, Delete, DataStore } from "../DataStore.js";
import { mergePatch } from "../dataUtils.js";

type Watcher = (results: any[]) => void;

class MemoryView<S extends DataSchema> {

    private watchers: Watcher[] = [];
    constructor(
        private readonly store: DataStore<S>,
        private readonly query: Query<S>
    ) {
    }

    addWatcher(watcher: Watcher) {
        this.watchers.push(watcher);
        // dispatch current results;
    }
}

export class MemoryStore<S extends DataSchema> extends BaseDataStore<S> {

    documents = new Map<any, Type<S>>();
    views = new Map<string, MemoryView<S>>();

    private getView(query: Query<S>) {
        let key = JSON.stringify(query);    //  probably should normalize.
        let view = this.views.get(key);
        if (!view) {
            this.views.set(key, view = new MemoryView<S>(this, query));
        }
        return view;
    }

    override watch<Q extends Query<S>>(query: Q, watcher: Watcher) {
        // now we just need the queries to watch.
        return () => { };
    }
    override create(document: Create<S>) {
        this.documents.set(this.getPrimaryKey(document), document);
    }
    override patch(changes: Patch<S>) {
        const pk = this.getPrimaryKey(changes);
        const oldDocument = this.documents.get(pk) as any;
        const newDocument = mergePatch(oldDocument, changes);
        if (newDocument !== oldDocument) {
            // notify changes.
            this.documents.set(pk, newDocument);
        }
    }
    override delete(document: Delete<S>) {
        this.documents.delete(this.getPrimaryKey(document));
    }
}