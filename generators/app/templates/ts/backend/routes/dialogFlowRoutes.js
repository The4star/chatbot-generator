const express = require('express');
const router = express.Router();

const { textQuery, eventQuery } = require('../config/chatbot')


router.post('/text_query', async (req, res) => {
    try {
        const response = await textQuery(req.body.text, req.body.userId, req.body.parameters)
        res.send(response)
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
    }
})

router.post('/event_query', async (req, res) => {
    try {
        const response = await eventQuery(req.body.event, req.body.userId, req.body.parameters)
        res.send(response)
    } catch (error) {
        console.error(error)
        res.status(500).send('error ' + error)
    }
})

module.exports = router;