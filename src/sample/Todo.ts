import { DataSchema } from "../Schema.js";
import { Type } from "../Type.js";

export const todoSchema = {
    id: "sample:Todo",
    type: "object",
    primaryKeys: ["name"],
    indexes: ["alpha", "complete"],
    properties: {
        name: {
            type: "string",
        },
        alpha: {
            type: "string",
        },
        complete: {
            type: "integer",
            minimum: 0,
            maximum: 100
        },
    }
} as const satisfies DataSchema;

export type Todo = Type<typeof todoSchema>;
