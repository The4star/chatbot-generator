const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const serverless = require('serverless-http');
const handler = serverless(app)


// config 
require('dotenv').config()

// app requirements
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())

// routes
const dfRoute = require('./routes/dialogFlowRoutes');
const twilioRoute = require('./routes/twilio');

app.use('/dialogflow', dfRoute);
app.use('/twilio', twilioRoute);

app.get('/', (req, res, next) => {
    res.send({ response: 'The Api is live and running' })
})

const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
const PORT = process.env.PORT || 5000;

if (isInLambda) {
    module.exports.handler = async (event, context) => {
        return await handler(event, context);
    }
} else {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
        console.log('Press Ctrl+C to quit.');
    });
}