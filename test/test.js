import assert from "assert";
import { parseCronExpression } from "../parser/parser.js";


const input = "*/15 0 1,15 * 1-5 /usr/bin/find";
const parsed = parseCronExpression(input);

assert.deepStrictEqual(parsed.minute, [0, 15, 30, 45]);
assert.deepStrictEqual(parsed.hour, [0]);
assert.deepStrictEqual(parsed["day of month"], [1, 15]);
assert.deepStrictEqual(parsed.month, [1,2,3,4,5,6,7,8,9,10,11,12]);
assert.deepStrictEqual(parsed["day of week"], [1,2,3,4,5]);
assert.strictEqual(parsed.command[0], "/usr/bin/find");

console.log(" All tests passed");
