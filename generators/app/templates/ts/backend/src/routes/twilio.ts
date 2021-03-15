import express, { Request, Response, Router } from 'express'
const router: Router = express.Router();

import { generateToken } from '../config/flex/token';
import { Flex } from '../config/flex/flex'

let flex: any;

router.post('/init', async (req: Request, res: Response) => {
    try {
        flex = new Flex(false); //change to true to log flex debugs.

        const target = 'target-' + req.body.userId;
        const flexChannel = await flex.createChannel(req.body.userId, target);
        const token = await generateToken(req.body.userId);

        let previousMessages = "Previous messages: \n";
        req.body.messageHistory.forEach((message: any) => {
            if (!message.chips) {  // don't include chips in message history
                previousMessages += `**${message.speaker}:** ${message.msg}\n`
            }
        });

        // Send first message, this message will come from the "system".  
        await flex.sendMessage("User requested chat with a live agent.");
        const sendAutoMessage = await flex.sendMessage(previousMessages);

        res.send({
            token,
            flexChannel,
            sendAutoMessage
        })

    } catch (error) {
        res.status(500).send(error)
    }

})

// send a message to the agent once the user is 
// added to and has joined the channel.
router.post('/connected', async (req: Request, res: Response) => {
    try {
        await flex.sendMessage(req.body.message);
        res.send({
            messageSent: true
        })

    } catch (error) {
        res.status(500).send(error)
    }
})




module.exports = router;