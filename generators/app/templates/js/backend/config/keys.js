const deployed = process.NODE_ENV === "staging" || process.NODE_ENV === "production"

// Set some of the configuration variables based on the environment
if (deployed) {
    module.exports = require('./prod.js')
} else {
    module.exports = require('./dev.js')
}