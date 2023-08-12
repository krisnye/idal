import { DataSchema } from "../Schema.js";
import { DataStore, Query, Patch, Create, Delete } from "../DataStore.js";
import { personSchema } from "../sample/Person.js";

export class MemoryStore<S extends DataSchema> implements DataStore<S> {
    watch<Q extends Query<S>>(query: Q, callback: (results: any[]) => void) {
        return () => { };
    }
    create(document: Create<S>) { }
    patch(changes: Patch<S>) { }
    delete(document: Delete<S>) { }
}

let persons!: DataStore<typeof personSchema>;
persons.watch({ select: ["age", "iq"] }, (results) => {

})