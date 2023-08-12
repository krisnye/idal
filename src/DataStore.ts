import { DataSchema } from "./Schema.js";
import { IndexedProperties, Patch, PrimaryKeyProperties } from "./Type.js";
import { Type } from "./Type.js";
import { personSchema } from "./sample/Person.js";
import { todoSchema } from "./sample/Todo.js";
import { DeepReadonly, Extends, Simplify, StringKeyof } from "./types.js";

export { Patch } from "./Type.js";
export type Operation = ">" | "<" | ">=" | "<=" | "==" | "!=" | "contains";

export type Constraints<T> = Readonly<{
    [K in StringKeyof<T>]?:
    T[K]
    | { [O in Exclude<Operation, "contains">]?: T[K] }
    | { contains: T[K][] }
}>;

export type Sort<T extends string> = Simplify<Readonly<{
    [K in T]?: boolean;
}>>;

export type Indexes<S extends DataSchema> = keyof IndexedProperties<S>;
export type Select<S extends DataSchema> = Readonly<Array<keyof Type<S>>>;

export type Query<S extends DataSchema, T = Type<S>, P extends ReadonlyArray<keyof T> = ReadonlyArray<keyof T>> = DeepReadonly<{
    sort?: Sort<Indexes<S>>;
    where?: Constraints<Indexes<S>>;
    offset?: number;
    count?: number;
    select?: P;
}>;

export type SelectQuery<S extends DataSchema, T = Type<S>, P extends ReadonlyArray<keyof T> = ReadonlyArray<keyof T>>
    = Query<S, T, P> & Readonly<{ select: P }>

export type Result<T, P extends ReadonlyArray<keyof T> = ReadonlyArray<keyof T>> = Simplify<Pick<T, P[number]>>;

export type Unwatch = () => void;

export type Create<S extends DataSchema> = Type<S>;
export type Delete<S extends DataSchema> = PrimaryKeyProperties<S>;

export interface DataStore<S extends DataSchema, T = Type<S>> {
    watch<P extends ReadonlyArray<keyof T>>(query: SelectQuery<S, T, P>, callback: (results: Result<T, P>[]) => void): Unwatch;
    watch(query: Query<S>, callback: (results: T[]) => void): Unwatch;
    create(document: Create<S>): void;
    patch(changes: Patch<S>): void;
    delete(document: Delete<S>): void;
}

let persons!: DataStore<typeof personSchema>;
persons.watch({ select: ["name", "age", "map"], sort: { age: true }, offset: 10, count: 100 } as const, (results) => {
    type Check = Extends<typeof results, {
        map?: Map<number, boolean>;
        name: string;
        age: number;
    }[]> & Extends<{
        map?: Map<number, boolean>;
        name: string;
        age: number;
    }[], typeof results>;
});

let todos!: DataStore<typeof todoSchema>;
todos.watch({}, (results) => {
    type Check = Extends<typeof results, {
        name: string;
        alpha?: string | undefined;
        complete?: number | undefined;
    }[]> & Extends<{
        name: string;
        alpha?: string | undefined;
        complete?: number | undefined;
    }[], typeof results>;
});

