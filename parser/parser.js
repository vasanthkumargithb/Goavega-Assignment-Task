const FIELD_RANGES = {
  minute: [0, 59],
  hour: [0, 23],
  "day of month": [1, 31],
  month: [1, 12],
  "day of week": [1, 7] 
};

function range(start, end) {
  const out = [];
  for (let i = start; i <= end; i++) {
    out.push(i);
  }
  return out;
}

function validateValues(field, values) {
  const [min, max] = FIELD_RANGES[field];
  for (const v of values) {
    if (v < min || v > max) {
      throw new Error(`Value "${v}" out of range for field "${field}" (${min}-${max})`);
    }
  }
}

function expandField(field, value) {
  const [min, max] = FIELD_RANGES[field];

  if (value === "*") {
    return range(min, max);
  }

  if (value.includes("/")) {
    const [base, stepStr] = value.split("/");
    const step = parseInt(stepStr, 10);
    if (isNaN(step) || step <= 0) {
      throw new Error(`Invalid step "${stepStr}" for field "${field}"`);
    }
    const baseRange = base === "*" ? range(min, max) : expandField(field, base);
    const result = baseRange.filter(v => (v - baseRange[0]) % step === 0);
    validateValues(field, result);
    return result;
  }

  if (value.includes("-")) {
    const [start, end] = value.split("-").map(Number);
    if (isNaN(start) || isNaN(end) || start > end) {
      throw new Error(`Invalid range "${value}" for field "${field}"`);
    }
    const result = range(start, end);
    validateValues(field, result);
    return result;
  }

  if (value.includes(",")) {
    const result = value.split(",").flatMap(v => expandField(field, v));
    validateValues(field, result);
    return result;
  }

  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Invalid value "${value}" for field "${field}"`);
  }
  if (num < min || num > max) {
    throw new Error(`Value "${num}" out of range for field "${field}" (${min}-${max})`);
  }
  return [num];
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
