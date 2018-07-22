export class AdvanceConsole {
  colors = {
    default: 32,
    error: 31,
    info: 34,
    success: 32,
  };

  symbols = {
    CR: '\u000A',
    dot: '․',
    error: '✖',
    info: 'i',
    success: '✓',
  };

  constructor() {
    // if (process.platform === 'win32') {

    // }
    this.symbols.CR = '\u000D\u000A';
    this.symbols.dot = '.';
    this.symbols.error = '\u00D7';
    this.symbols.info = 'i';
    this.symbols.success = '\u221A';
  }

  color(type: any) {
    if (!this.colors[type]) {
      type = 'default';
    }
    switch (type) {
      case 'success':
        return 'color: #2E812E; font-weight: bold; font-size: 14px;';
      case 'info':
        return 'color: #0D3298; font-weight: bold; font-size: 14px;';
      case 'error':
        return 'color: maroon; font-weight: bold; font-size: 14px;';
      default:
        return 'color: black';
    }
  }

  printLog(type: any, args: any) {
    const decorators = [`${type}:`, this.color(type)];
    args.unshift(`%c ${type}:`, this.color(type));
    return console.log.apply(console, args);
  }

  line(...args: string[]) {
    console.log.apply(console, [this.symbols.CR].concat(args).concat(this.symbols.CR));
  }

  info(...args: any[]) {
    this.printLog('info', args);
  }

  success(...args: any[]) {
    this.printLog('success', args);
  }

  error(...args: any[]) {
    this.printLog('error', args);
  }
}
