import type { JSONSchema7, JSONSchema7Object } from "json-schema";
import type { DeepReadonly, Primitive, Simplify, StringKeyof } from "./types.js";

export interface SchemaTypes {
    integer: number,
    number: number,
    string: string,
    boolean: boolean,
    object: object,
    null: null,
    array: Array<unknown>,
    //  extensions
    Map: Map<unknown, unknown>,
    Set: Set<unknown>,
    Int8Array: Int8Array,
    Uint8Array: Uint8Array,
    Int16Array: Int16Array,
    Uint16Array: Uint16Array,
    Int32Array: Int32Array,
    Uint32Array: Uint32Array,
    Float32Array: Float32Array,
    Float64Array: Float64Array,
    Blob: Blob,
    File: File,
}

type SchemaExtensions = { type?: keyof SchemaTypes, keys?: SchemaObject };
export type Schema = Omit<JSONSchema7, "type"> & SchemaExtensions;
export type SchemaObject = Omit<JSONSchema7Object, "type"> & SchemaExtensions;

/**
 * Represents a data document schema. Must be an object type.
 */
export type DataSchema = DeepReadonly<{
    id: string;
    type: "object";

    primaryKeys: string[];
    indexes?: string[];
    required?: string[];

    properties: {
        [key: string]: Schema;
    };
}>

type BaseType<S extends DeepReadonly<SchemaObject>> =
    S extends Primitive ? S :
    S extends DeepReadonly<{ enum: unknown[] }> ? S["enum"][number] :
    S extends DeepReadonly<{ type: "array", items: Schema }> ? BaseType<S["items"]>[] :
    S extends DeepReadonly<{ type: "Set", items: Schema }> ? Set<BaseType<S["items"]>> :
    S extends DeepReadonly<{ type: "Map", keys: Schema, items: Schema }> ? Map<BaseType<S["keys"]>, BaseType<S["items"]>> :
    S extends DeepReadonly<{ properties: object }> ? {
        [K in StringKeyof<S["properties"]>]: S["properties"][K] extends DeepReadonly<Schema> ? BaseType<S["properties"][K]> : "?"
    } :
    S extends DeepReadonly<SchemaObject> ? (
        S["type"] extends keyof SchemaTypes ? SchemaTypes[S["type"]] :
        {}
    ) : unknown;

export type FieldsInProperty<D extends DataSchema, P extends "indexes" | "primaryKeys" | "required">
    = D[P] extends Readonly<string[]> ? { [K in D[P][number]]: K }[D[P][number]] : never;
export type FieldsNotInProperty<D extends DataSchema, P extends "indexes" | "primaryKeys" | "required">
    = D[P] extends Readonly<string[]>
    ? { [K in keyof D["properties"]]: K extends D[P][number] ? never : K }[keyof D["properties"]]
    : keyof D["properties"];

export type RequiredProperties<D extends DataSchema> = Pick<BaseType<D>, FieldsInProperty<D, "required"> | FieldsInProperty<D, "primaryKeys">>;
export type OptionalProperties<D extends DataSchema> = Partial<Pick<BaseType<D>, FieldsNotInProperty<D, "required">>>;
export type PrimaryKeyProperties<D extends DataSchema> = Pick<BaseType<D>, FieldsInProperty<D, "primaryKeys">>;
export type IndexedProperties<D extends DataSchema> = Pick<BaseType<D>, FieldsInProperty<D, "indexes"> | FieldsInProperty<D, "primaryKeys">>;

export type Type<D extends DataSchema> = Simplify<RequiredProperties<D> & OptionalProperties<D>>;
export type Patch<D extends DataSchema> = PrimaryKeyProperties<D> & Partial<Type<D>>;
