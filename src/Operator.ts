import { StringKeyof } from "./types.js";

export const operators = {
    "<": (a: number, b: number) => a < b,
    ">": (a: number, b: number) => a > b,
    "<=": (a: number, b: number) => a <= b,
    ">=": (a: number, b: number) => a >= b,
    "==": (a: string | number, b: string | number) => a == b,
    "!=": (a: string | number, b: string | number) => a != b,
    "contains": <T extends string | number>(a: T[], b: T) => a.includes(b),
} as const satisfies Record<string, (a: any, b: any) => boolean>;

export type Operators = typeof operators;
export type Operator = StringKeyof<typeof operators>;
export type ValidOperations<T> = { [OP in Operator]: T extends Parameters<Operators[OP]>[0] ? OP : never }[Operator];
export type SecondArgType<OP extends Operator> = Parameters<Operators[OP]>[1];



