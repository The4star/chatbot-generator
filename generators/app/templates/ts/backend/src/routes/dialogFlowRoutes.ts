import express, { Router, Request, Response } from 'express';
const router: Router = express.Router();

import { textQuery, eventQuery } from '../config/chatbot';


router.post('/text_query', async (req: Request, res: Response) => {

    try {
        const response = await textQuery(req.body.text, req.body.userId, req.body.parameters)
        res.send(response)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

router.post('/event_query', async (req: Request, res: Response) => {
    try {
        const response = await eventQuery(req.body.event, req.body.userId, req.body.parameters)
        res.send(response)
    } catch (error) {
        console.error(error)
        res.status(500).send('error ' + error)
    }
})

module.exports = router;