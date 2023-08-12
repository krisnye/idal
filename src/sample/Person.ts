import { DataSchema } from "../Schema.js";
import { IndexedProperties, OptionalProperties, PrimaryKeyProperties, RequiredProperties, Type } from "../Type.js";
import { Extends } from "../types.js";

export const personSchema = {
    id: "sample:Person",
    type: "object",
    primaryKeys: ["name"],
    required: ["name", "age", "gender"],
    indexes: ["age"],
    properties: {
        type: {
            type: "string",
        },
        name: {
            type: "string",
        },
        position: {
            type: "object",
            properties: {
                x: { type: "integer" },
                y: { type: "integer" },
            }
        },
        iq: {
            type: "number",
        },
        age: {
            type: "integer",
            minimum: 0
        },
        values: {
            enum: [1, 3, 5, 7]
        },
        gender: {
            enum: ["male", "female", "other"]
        },
        numbers: {
            type: "Int32Array",
        },
        normalNumbers: {
            type: "array",
            items: { type: "number" }
        },
        set: {
            type: "Set",
            items: { type: "string" }
        },
        map: {
            type: "Map",
            keys: { type: "number" },
            items: { type: "boolean" }
        },
        picture: {
            type: "File",
        }
    }
} as const satisfies DataSchema;

export type PersonSchemaId = typeof personSchema["id"];
export type Person = Type<typeof personSchema>;

type PersonRequiredProperties = RequiredProperties<typeof personSchema>;
type PersonOptionalProperties = OptionalProperties<typeof personSchema>;
type PersonPrimaryKeyProperties = PrimaryKeyProperties<typeof personSchema>;
type PersonIndexedProperties = IndexedProperties<typeof personSchema>;

// this verifies at compile time that are types are what we expect them to be.
type CompileTimeTypeCheck = Extends<PersonRequiredProperties, {
    name: string;
    age: number;
    gender: "male" | "female" | "other";
}> & Extends<{
    name: string;
    age: number;
    gender: "male" | "female" | "other";
}, PersonRequiredProperties> & Extends<Required<PersonOptionalProperties>, {
    type: string;
    values: 1 | 3 | 5 | 7;
    iq: number,
    position: {
        x: number;
        y: number;
    };
    numbers: Int32Array,
    normalNumbers: number[],
    set: Set<string>,
    map: Map<number, boolean>,
    picture: File,
}> & Extends<{
    type: string;
    values: 1 | 3 | 5 | 7;
    position: {
        x: number;
        y: number;
    };
    iq: number,
    numbers: Int32Array,
    normalNumbers: number[],
    set: Set<string>,
    map: Map<number, boolean>,
    picture: File,
}, Required<PersonOptionalProperties>> & Extends<PersonPrimaryKeyProperties, {
    name: string;
}> & Extends<{
    name: string;
}, PersonPrimaryKeyProperties> & Extends<PersonIndexedProperties, {
    name: string;
    age: number;
}> & Extends<{
    name: string;
    age: number;
}, PersonIndexedProperties>;

