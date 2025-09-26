# Cron Expression Parser

A simple Node.js command-line tool that parses a standard cron expression and expands each field into the actual values when it will run.

The tool supports the standard 5-field cron format:


---

## 📌 Example

Input:
```bash
node index.js "*/15 0 1,15 * 1-5 /usr/bin/find"
minute        0 15 30 45
hour          0
day of month  1 15
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   1 2 3 4 5
command       /usr/bin/find

Run
node index.js "<your-cron-string>"


Example:

node index.js "0 12 * * 0 echo hello"
