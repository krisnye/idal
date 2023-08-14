import { DataSchema, Type } from "./DataSchema.js";
import { Create, DataStore, Delete, Patch, Query, Result, SelectQuery, Unwatch } from "./DataStore.js";

export abstract class BaseDataStore<S extends DataSchema, T = Type<S>> implements DataStore<S, T> {

    constructor(
        protected readonly schema: S
    ) {
    }

    abstract watch<P extends ReadonlyArray<keyof T>>(query: SelectQuery<S, T, P>, callback: (results: Result<T, P>[]) => void): Unwatch;
    abstract watch(query: Query<S>, callback: (results: T[]) => void): Unwatch;
    abstract create(document: Create<S>): void;
    abstract patch(changes: Patch<S>): void;
    abstract delete(document: Delete<S>): void;

    protected getPrimaryKey(record: any) {
        const { primaryKeys } = this.schema;
        return primaryKeys.length === 1 ? (record as any)[primaryKeys[0] as any] : primaryKeys.map(name => (record as any)[name]).join(",");
    }

}