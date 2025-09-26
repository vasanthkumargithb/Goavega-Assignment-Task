
const FIELD_RANGES = {
  minute: [0, 59],
  hour: [0, 23],
  "day of month": [1, 31],
  month: [1, 12],
  "day of week": [1, 7] 
};


function expandField(field, value) {
  const [min, max] = FIELD_RANGES[field];

  if (value === "*") {
    return range(min, max);
  }

  if (value.includes("/")) {
    const [base, stepStr] = value.split("/");
    const step = parseInt(stepStr, 10);
    const baseRange = base === "*" ? range(min, max) : expandField(field, base);
    return baseRange.filter(v => (v - baseRange[0]) % step === 0);
  }

  if (value.includes("-")) {
    const [start, end] = value.split("-").map(Number);
    return range(start, end);
  }

  if (value.includes(",")) {
    return value.split(",").flatMap(v => expandField(field, v));
  }

  const num = parseInt(value, 10);
  if (isNaN(num) || num < min || num > max) {
    throw new Error(`Invalid value "${value}" for field "${field}"`);
  }
  return [num];
}


function range(start, end) {
  const out = [];
  for (let i = start; i <= end; i++) {
    out.push(i);
  }
  return out;
}


export function parseCronExpression(input) {
  const parts = input.trim().split(/\s+/);
  if (parts.length < 6) {
    throw new Error("Cron expression must have 5 fields plus a command");
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek, ...command] = parts;

  return {
    minute: expandField("minute", minute),
    hour: expandField("hour", hour),
    "day of month": expandField("day of month", dayOfMonth),
    month: expandField("month", month),
    "day of week": expandField("day of week", dayOfWeek),
    command: [command.join(" ")]
  };
}
