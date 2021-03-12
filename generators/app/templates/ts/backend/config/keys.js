const deployed = !!process.env.LAMBDA_TASK_ROOT || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === "production";

// Set some of the configuration variables based on the environment
if (deployed) {
    module.exports = require('./prod.js')
} else {
    module.exports = require('./dev.js')
}