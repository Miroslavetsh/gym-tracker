type LogLevel = "debug" | "info" | "warn" | "error";

interface LogConfig {
  enableInProduction: boolean;
  minLevel: LogLevel;
}

const config: LogConfig = {
  enableInProduction: false,
  minLevel: __DEV__ ? "debug" : "warn",
};

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const colors: Record<LogLevel, string> = {
  debug: "\x1b[36m",
  info: "\x1b[32m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};

const resetColor = "\x1b[0m";

function shouldLog(level: LogLevel): boolean {
  if (!__DEV__ && !config.enableInProduction) {
    return false;
  }
  return levels[level] >= levels[config.minLevel];
}

function formatMessage(
  level: LogLevel,
  category: string,
  message: string
): string {
  const timestamp = new Date().toISOString().split("T")[1].slice(0, -1);
  const levelUpper = level.toUpperCase().padEnd(5);
  const categoryUpper = category.toUpperCase().padEnd(12);

  if (__DEV__ && typeof console.log === "function") {
    return `${colors[level]}${levelUpper}${resetColor} [${categoryUpper}] ${message}`;
  }

  return `[${timestamp}] ${levelUpper} [${categoryUpper}] ${message}`;
}

export const logger = {
  debug: (category: string, message: string, ...args: any[]) => {
    if (shouldLog("debug")) {
      console.log(formatMessage("debug", category, message), ...args);
    }
  },

  info: (category: string, message: string, ...args: any[]) => {
    if (shouldLog("info")) {
      console.log(formatMessage("info", category, message), ...args);
    }
  },

  warn: (category: string, message: string, ...args: any[]) => {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", category, message), ...args);
    }
  },

  error: (
    category: string,
    message: string,
    error?: Error | unknown,
    ...args: any[]
  ) => {
    if (shouldLog("error")) {
      const errorDetails =
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error;

      console.error(
        formatMessage("error", category, message),
        errorDetails,
        ...args
      );
    }
  },

  group: (category: string, label: string, fn: () => void) => {
    if (__DEV__) {
      console.group(`📦 [${category.toUpperCase()}] ${label}`);
      fn();
      console.groupEnd();
    } else {
      fn();
    }
  },

  object: (category: string, label: string, obj: any) => {
    if (shouldLog("debug")) {
      console.log(`📦 [${category.toUpperCase()}] ${label}:`, obj);
    }
  },

  api: {
    request: (method: string, url: string, data?: any) => {
      if (shouldLog("debug")) {
        logger.debug("API", `${method} ${url}`, data ? { data } : "");
      }
    },
    response: (method: string, url: string, status: number, data?: any) => {
      if (shouldLog("debug")) {
        const emoji = status >= 200 && status < 300 ? "✅" : "❌";
        logger.debug(
          "API",
          `${emoji} ${method} ${url} [${status}]`,
          data ? { data } : ""
        );
      }
    },
    error: (method: string, url: string, error: any) => {
      logger.error("API", `${method} ${url}`, error);
    },
  },

  configure: (newConfig: Partial<LogConfig>) => {
    Object.assign(config, newConfig);
  },
};

export const logCategories = {
  API: "API",
  AUTH: "AUTH",
  NAVIGATION: "NAV",
  STORE: "STORE",
  COMPONENT: "COMP",
  UTIL: "UTIL",
} as const;
