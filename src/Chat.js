import React, { useState } from 'react';
import styled from 'styled-components';

import {
  INITIAL_HISTORY,
  INITIAL_MESSAGES,
  MESSAGE_TYPES,
  PHASES,
  QUESTIONNAIRE_CONTENT,
} from './constants';
import { Flex } from './Flex';
import { Message } from './Message';
import { getPrompt } from './promptTemplates';

const ChatBox = styled.div`
  border: 1px solid gray;
  width: calc(100vw - 100px);
  height: calc(100vh - 150px);
  padding: 30px;
  margin: 30px 30px 20px 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Input = styled.textarea`
  font-family: 'Inter', sans-serif;
  width: calc(100vw - 100px);
  border: 1px solid gray;
  border-radius: 20px;
  padding: 10px;
`;

function Chat({ visible }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [loading, setLoading] = useState(false);
  const [chatState, setChatState] = useState({ history: INITIAL_HISTORY });
  const [phase, setPhase] = useState(PHASES.TYPE_OF_SPACE);
  const stateSetters = {
    setMessages,
    setLoading,
    setChatState,
    setPhase,
  };

  return (
    <Flex
      width="100vw"
      height="100vh"
      flexDirection="column"
      alignItems="center"
      style={{
        position: 'absolute',
        top: visible ? '0' : '100vh',
        transition: 'top 1s ease-in-out',
      }}
    >
      <ChatBox>
        {
          messages.map(msg => (
            <Message
              isUserMessage={msg.fromUser}
              messageType={msg.messageType}
              chatState={chatState}
              stateSetters={stateSetters}
              phase={phase}
            >
              {msg.content}
            </Message>
          ))
        }
        {loading ? <Flex>Thinking...</Flex> : null}
      </ChatBox>
      <Input disabled={phase === PHASES.DESIGN_SELECTION} onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const userMessage = e.target.value;
          e.target.value = '';
          setMessages(prev => ([...prev, { fromUser: true, content: userMessage }]))
          
          switch (phase) {
            case PHASES.TYPE_OF_SPACE:
              setMessages(prev => ([...prev, { fromUser: false, content: QUESTIONNAIRE_CONTENT, }]));
              setChatState(prev => ({ ...prev, typeOfSpace: userMessage }));
              setPhase(PHASES.QUESTIONNAIRE);
              break;
              case PHASES.QUESTIONNAIRE:
                setLoading(true);
                fetch("/gpt-chat", {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json; charset=utf-8' },
                  body: JSON.stringify({ ...chatState, message: getPrompt(PHASES.QUESTIONNAIRE, [userMessage]) }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    const { message, ...state } = data;
                    const designSuggestions = JSON.parse(message);
                    const itemNames = [];
                    const searchTerms = [];
                    Object.entries(designSuggestions).forEach(([category, items]) => {
                      switch (category) {
                        case 'design_ideas':
                          break;
                        case 'interior_designers':
                          items.forEach(item => {
                            itemNames.push(item.name);
                            searchTerms.push(`${item.name} interior design`);
                          });
                          break;
                        case 'artists':
                          items.forEach(item => {
                            itemNames.push(item.name);
                            searchTerms.push(`${item.name} artwork`);
                          });
                          break;
                        default:
                          console.error('Wrong design suggestion json format');
                          break;
                      }
                    });
                    setChatState(prev => ({ ...prev, ...state, designSuggestions }));
                    fetch("/google-image-search", {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json; charset=utf-8' },
                      body: JSON.stringify({ itemNames, searchTerms }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        const { images } = data;
                        setLoading(false);
                        setMessages(prev => ([...prev, { fromUser: false, content: message, messageType: MESSAGE_TYPES.DESIGN_SELECTION }]));
                        setChatState(prev => ({ ...prev, ...state, images, suggestionNames: itemNames }));
                        setPhase(PHASES.DESIGN_SELECTION);
                      });
                  });
                break;
              case PHASES.SPACE_DESCRIPTION:
                const midjourneyPrompt = getPrompt(PHASES.SPACE_DESCRIPTION, [userMessage, chatState.designExplanationFormatted]);
                setMessages(prev => ([...prev, {
                  fromUser: false, 
                  content: `Please paste the following prompt into Midjourney:\n\n${midjourneyPrompt}\n\nOnce done, return here and paste the URL of the generated images.`,
                }]));
                setChatState(prev => ({ ...prev, midjourneyPrompt }));
                setPhase(PHASES.USER_IMAGE_UPLOAD);
                break;
              case PHASES.USER_IMAGE_UPLOAD:
                setLoading(true);
                fetch("/gpt-chat", {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json; charset=utf-8' },
                  body: JSON.stringify({ ...chatState, message: getPrompt(PHASES.USER_IMAGE_UPLOAD, []) }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    const { message, ...state } = data;
                    setLoading(false);
                    setMessages(prev => ([...prev, { fromUser: false, content: message }]));
                    setChatState(prev => ({ ...prev, ...state }));
                  });
                break;
            default:
              setLoading(true);
              fetch("/gpt-chat", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({ ...chatState, message: userMessage }),
              })
                .then((res) => res.json())
                .then((data) => {
                  const { message, ...state } = data;
                  setLoading(false);
                  setMessages(prev => ([...prev, { fromUser: false, content: message }]));
                  setChatState(prev => ({ ...prev, ...state }));
                });
              break;
          }
        }
      }} />
    </Flex>
  );
}

export default Chat;
