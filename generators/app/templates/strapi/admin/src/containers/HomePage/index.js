import React, { memo, useState } from 'react';
import { auth } from 'strapi-helper-plugin';
import { get } from 'lodash';
import { Block, Container, Wave } from './components';
import { Button, BadNotification, GoodNotification, NotificationArea } from './additionalComponents';
import { handleClick } from './additionalFunctionality';
import Toggle from './Toggle';

const HomePage = ({ global: { plugins }, history: { push } }) => {
  const username = get(auth.getUserInfo(), 'firstname', '');
  const [notification, setNotification] = useState(null)

  return (
    <>
      <NotificationArea className="notification-area">
        {
          notification ?
            notification.type === "good" ?
              <GoodNotification className="notification-area__notification">{notification.message}</GoodNotification>
              :
              <BadNotification className="notification-area__notification">{notification.message}</BadNotification>
            : null
        }
      </NotificationArea>
      <Container className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Block>
              <h1>Strapi Dialogflow interaction Model Builder</h1>
              <p>
                Hello {username},
              </p>
              <p>
                Follow the instructions below to build your interaction model.
              </p>
              <p>
                When you are ready to build your interaction model, click the button below.
              </p>
              <Wave />
              <Button onClick={() => handleClick(setNotification)}>Export to Dialogflow</Button>
            </Block>
            <Block>
              <h2>Instructions</h2>
              <Toggle title="1. Settings">
                <p>
                  First make sure you set up the settings correctly.
                  <ul>
                    <li>
                      Click settings on the left
                    </li>
                    <li>
                      Add a title, Description and Min confidence.
                    </li>
                    <li>
                      Set up a service account in dialogflow for your agent and paste the json content
                      into the service account section.
                    </li>
                    <li>
                      Finally make sure you add responses to your Default fallback intent.
                    </li>
                  </ul>
                </p>
              </Toggle>
              <Toggle title="2. Intents">
                <ul>
                  <li>
                    Click intents to the left and create a new one.
                  </li>
                  <li>
                    Enter an intent Name, a priority and an event name if needed.
                  </li>
                  <li>
                    Enter your utterances which are separated by a new line.
                  </li>
                  <li>
                    Add as many responses as you like, each new response is a separate response
                    for dialogflow to choose from.
                  </li>
                  <li>
                    Add your suggestion chips, these can be a normal chip or a link chip.
                  </li>
                  <li>
                    If your intent is using entities enter them in the utterances like so: {"{Food|Pizza}"}
                  </li>
                  <li>
                    You first need to create an entity and then you can link it to your intent after.
                  </li>
                </ul>
              </Toggle>
              <Toggle title="3. Entities">
                <ul>
                  <li>
                    Give your entity the same name you used in the utterances, e.g if you wrote {"{Food|Pizza}"} it is <strong>Food</strong>
                  </li>
                  <li>
                    Add as many Entity values as you want adding a main Entity and separate synonyms, synonyms are separated by a space.
                  </li>
                  <li>
                    Go back to your intent and on the right hand side choose the entity to set against the intent.
                  </li>
                </ul>
              </Toggle>
            </Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);