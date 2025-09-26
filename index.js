
import { parseCronExpression } from "./parser/parser.js";


const input = process.argv.slice(2).join(" ");

if (!input) {
  console.error("Usage: node index.js '<cron_expression>'");
  process.exit(1);
}

try {
  const result = parseCronExpression(input);

  for (const [field, values] of Object.entries(result)) {
    console.log(field.padEnd(14, " ") + values.join(" "));
  }
} catch (err) {
  console.error("Error:", err.message);
  process.exit(1);
}
