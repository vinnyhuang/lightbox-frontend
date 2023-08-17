import React, { useState } from 'react';
import styled from 'styled-components';

import { MESSAGE_TYPES, PHASES } from './constants';
import { Flex } from './Flex';
import { Message } from './Message';
import { getPrompt } from './promptTemplates';

const INITIAL_MESSAGES = [{
  fromUser: false,
  content: "Welcome to Lightbox AI! My name is Lightbot, and I’m here to help you design your space. To get started, tell me about your project. What are we designing?",
}];

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
  const [chatState, setChatState] = useState({ history: [] });
  const [phase, setPhase] = useState(PHASES.TYPE_OF_SPACE);
  const stateSetters = {
    setMessages,
    setLoading,
    setChatState,
    setPhase,
  };
  console.log('messages', messages);

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
              stateSetters={stateSetters}
            >
              {msg.content}
            </Message>
          ))
        }
        {loading ? <Flex>Thinking...</Flex> : null}
      </ChatBox>
      <Input disabled={phase === PHASES.QUESTIONNAIRE} onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const userMessage = e.target.value;
          e.target.value = '';
          setMessages(prev => ([...prev, { fromUser: true, content: userMessage }]))
          
          switch (phase) {
            case PHASES.TYPE_OF_SPACE:
              setLoading(true);
              fetch("/gpt-chat", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({ ...chatState, message: getPrompt(PHASES.TYPE_OF_SPACE) }),
              })
                .then((res) => res.json())
                .then((data) => {
                  const { message, ...state } = data;
                  setLoading(false);
                  setMessages(prev => ([...prev, { fromUser: false, content: message, messageType: MESSAGE_TYPES.QUESTIONNAIRE }]));
                  setChatState(prev => ({ ...prev, ...state, typeOfSpace: userMessage, questions: JSON.parse(message) }));
                  setPhase(PHASES.QUESTIONNAIRE);
                });
              break;
            case PHASES.MORE_DETAILS:
              setLoading(true);
              fetch("/gpt-chat", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({ ...chatState, message: getPrompt(PHASES.MORE_DETAILS, [chatState.selections, userMessage]) }),
              })
                .then((res) => res.json())
                .then((data) => {
                  const { message, ...state } = data;
                  setLoading(false);
                  setMessages(prev => ([...prev, { fromUser: false, content: message, messageType: MESSAGE_TYPES.DESIGN_IMAGES }]));
                  setChatState(prev => ({ ...prev, ...state, /* designers: JSON.parse(message) */ }));
                  setPhase(PHASES.DESIGN_IMAGES);
                });
              break;
            // case X:
            //   setLoading(true);
            //   fetch("/gpt-chat", {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json; charset=utf-8' },
            //     body: JSON.stringify({ ...chatState, message: userMessage }),
            //   })
            //     .then((res) => res.json())
            //     .then((data) => {
            //       const { message, ...state } = data;
            //       setLoading(false);
            //       setMessages(prev => ([...prev, { fromUser: false, content: message }]));
            //       setChatState(prev => ({ ...prev, ...state }));
            //     });
            //   break;
            default:
              break;
          }
        }
      }} />
    </Flex>
  );
}

export default Chat;
