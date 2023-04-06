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
            this.deleteOldLogs(); // 在应用启动时调用
        }
    }

    private log(level: LogLevel, message: string): void {
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

    public deleteOldLogs(): void {
        const logDir = path.join(process.cwd(), 'logs');
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 获取 30 天前的日期
        const files = fs.readdirSync(logDir);
        for (const file of files) {
            const filePath = path.join(logDir, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile() && stats.birthtime  < thirtyDaysAgo) { // 检查文件是否为日志文件，以及是否在 30 天前修改过
                fs.unlinkSync(filePath); // 删除日志文件
            }
        }
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