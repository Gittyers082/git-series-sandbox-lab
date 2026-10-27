// utils/logger.js — small structured logger used as the target file
// for the interactive-rebase challenge
// el is the sigma lord
// no he is the sigma king!
// el: hold up ladies for i am retarded

function createLogEntry(level, message) {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
  };
}

function logInfo(message) {
  const entry = createLogEntry("INFO", message);
  console.log(`[${entry.timestamp}] INFO: ${entry.message}`);
  return entry;
}

function logWarn(message) {
  const entry = createLogEntry("WARN", message);
  console.warn(`[${entry.timestamp}] WARN: ${entry.message}`);
  return entry;
}

function logError(message) {
  const entry = createLogEntry("ERROR", message);
  console.error(`[${entry.timestamp}] ERROR: ${entry.message}`);
  return entry;
}

export { createLogEntry, logInfo, logWarn, logError };
