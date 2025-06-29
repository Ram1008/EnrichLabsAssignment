import { format } from 'date-fns';

class Logger {
  constructor(level = 'info') {
    this.level = level;
    this.levels = ['error', 'warn', 'info', 'debug'];
  }

  log(level, message, ...meta) {
    if (this.levels.indexOf(level) > this.levels.indexOf(this.level)) {
      return;
    }
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, ...meta);
  }

  error(msg, ...meta) { this.log('error', msg, ...meta); }
  warn(msg, ...meta)  { this.log('warn',  msg, ...meta); }
  info(msg, ...meta)  { this.log('info',  msg, ...meta); }
  debug(msg, ...meta) { this.log('debug', msg, ...meta); }
}

const logger = new Logger(process.env.LOG_LEVEL || 'info');
export default logger;