import express, { json, Express, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
const app: Express = express();
import serverless from 'serverless-http';
import { APIGatewayProxyEvent, APIGatewayProxyEventV2, Context } from 'aws-lambda';
const handler = serverless(app);

// app requirements
app.use(morgan('dev'));
app.use(json());
app.use(cors())

// routes
const dfRoute = require('./routes/dialogFlowRoutes');
const twilioRoute = require('./routes/twilio');

app.use('/dialogflow', dfRoute);
app.use('/twilio', twilioRoute);

app.get('/', (_req: Request, res: Response) => {
    res.send({ response: 'The Api is live and running' })
})

const isInLambda = !!process.env.LAMBDA_TASK_ROOT;
const PORT = process.env.PORT || 5000;

if (isInLambda) {
    module.exports.handler = async (event: APIGatewayProxyEvent | APIGatewayProxyEventV2, context: Context) => {
        return await handler(event, context);
    }
} else {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
        console.log('Press Ctrl+C to quit.');
    });
}