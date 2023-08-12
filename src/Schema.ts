import type { JSONSchema7, JSONSchema7Object } from "json-schema";
import type { DeepReadonly } from "./types.js";

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
