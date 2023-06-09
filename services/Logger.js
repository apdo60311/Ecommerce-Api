class Logger {
    static getInstance() {
        if (!this.instance) {
            this.instance = new Logger();
        }
        return this.instance;
    }
    logs = [];
    log({prefix = 'LOGGER', seperator = ': ', message = 'Empty Log'} = {}) {
        this.logs.push(message);
        console.log(`${prefix}${seperator}${message}`);
        console.log('----------------------------------');
    }

}

module.exports = {
    Logger
}