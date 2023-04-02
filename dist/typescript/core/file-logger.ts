import fs from 'fs';
import path from 'path';

enum LogLevel {
    Error,
    Warn,
    Info,
}

class Logger {
    private logFile: number;
    private logLevel: LogLevel;
    private logFileName: string;

    constructor(logFilePath: string, logLevel: LogLevel = LogLevel.Info) {
        this.logFile = fs.openSync(logFilePath, 'a'); // Open file and get the file descriptor
        this.logLevel = logLevel;
        this.logFileName = logFilePath;

        // Ensure the logs directory exists
        const logDir = path.join(path.dirname(path.dirname(this.logFileName)), 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }

    private log(level: LogLevel, message: string): void {
        if (level <= this.logLevel) {
            const logDate = new Date().toISOString();
            const logLevelStr = LogLevel[level].toUpperCase();
            const logMessage = `${logDate}: [${logLevelStr}] ${message}\n`;

            // Append the log message to the log file
            fs.appendFileSync(this.logFile, logMessage);
        }
    }

    public error(message: string): void {
        this.log(LogLevel.Error, message);
    }

    public warn(message: string): void {
        this.log(LogLevel.Warn, message);
    }

    public info(message: string): void {
        this.log(LogLevel.Info, message);
    }

    public close(): void {
        fs.closeSync(this.logFile);
    }

    public getLogFileName(): string {
        return this.logFileName;
    }
}

const currentDate = new Date();
const year = currentDate.getFullYear().toString();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const date = currentDate.getDate().toString().padStart(2, '0');

const logFileName = `log-${year}-${month}-${date}.txt`;

const logFilePath = path.join(process.cwd(), 'logs', logFileName);

const logger = new Logger(logFilePath, LogLevel.Info);
export default logger;

