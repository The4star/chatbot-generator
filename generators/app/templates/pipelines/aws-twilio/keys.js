const deployed = !!process.env.LAMBDA_TASK_ROOT;

// Set some of the configuration variables based on the environment
if (deployed) {
    module.exports = require('./prod.js')
} else {
    module.exports = require('./dev.js')
}