"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Error"] = 0] = "Error";
    LogLevel[LogLevel["Warn"] = 1] = "Warn";
    LogLevel[LogLevel["Info"] = 2] = "Info";
})(LogLevel || (LogLevel = {}));
class Logger {
    constructor(logFilePath, logLevel = LogLevel.Info) {
        this.logFile = fs_1.default.openSync(logFilePath, 'a'); // Open file and get the file descriptor
        this.logLevel = logLevel;
        this.logFileName = logFilePath;
        // Ensure the logs directory exists
        const logDir = path_1.default.join(path_1.default.dirname(path_1.default.dirname(this.logFileName)), 'logs');
        if (!fs_1.default.existsSync(logDir)) {
            fs_1.default.mkdirSync(logDir, { recursive: true });
        }
        // Check and delete old log files
        const currentDate = new Date();
        const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
        const oldLogFileName = `log-${thirtyDaysAgo.getFullYear()}-${(thirtyDaysAgo.getMonth() + 1).toString().padStart(2, '0')}-${thirtyDaysAgo.getDate().toString().padStart(2, '0')}.txt`;
        const oldLogFilePath = path_1.default.join(logDir, oldLogFileName);
        if (fs_1.default.existsSync(oldLogFilePath)) {
            fs_1.default.unlinkSync(oldLogFilePath);
        }
    }
    log(level, message) {
        if (level <= this.logLevel) {
            const logDate = new Date();
            const timeZoneOffset = -8; // 设置时区偏移量，比如东八区就是 -8
            const timeZoneOffsetMs = timeZoneOffset * 60 * 60 * 1000; // 将小时转换为毫秒
            const localDate = new Date(logDate.getTime() - timeZoneOffsetMs);
            // const localDate = new Date(logDate.getTime());
            const formattedDate = localDate.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
            const logLevelStr = LogLevel[level].toUpperCase();
            const logMessage = `${formattedDate} - [${logLevelStr}] ${message}\n`;
            // Append the log message to the log file
            fs_1.default.appendFileSync(this.logFile, logMessage);
        }
    }
    error(message) {
        this.log(LogLevel.Error, message);
    }
    warn(message) {
        this.log(LogLevel.Warn, message);
    }
    info(message) {
        this.log(LogLevel.Info, message);
    }
    close() {
        fs_1.default.closeSync(this.logFile);
    }
    getLogFileName() {
        return this.logFileName;
    }
}
const currentDate = new Date();
const year = currentDate.getFullYear().toString();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const date = currentDate.getDate().toString().padStart(2, '0');
const logFileName = `log-${year}-${month}-${date}.txt`;
const logFilePath = path_1.default.join(process.cwd(), 'logs', logFileName);
const logger = new Logger(logFilePath, LogLevel.Info);
exports.default = logger;
//# sourceMappingURL=file-logger.js.map