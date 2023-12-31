import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

import { MESSAGE_TYPES } from './constants';
import { DesignSelection } from './DesignSelection';

const MessageBubble = styled.div`
  padding: 15px;
  border-radius: 20px;
  max-width: calc(100vw - 600px);
  margin-bottom: 12px;
  font-size: 14px;
`;

const BotMessage = styled(MessageBubble)`
  background-color: #CAFFF7;
  align-self: flex-start;
`;

const UserMessage = styled(MessageBubble)`
  background-color: #FF7EA7;
  align-self: flex-end;
`;

const NameLabel = styled.div`
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 800;
  padding: 0 8px;
`;

const BotLabel = styled(NameLabel)`
  color: #C76383;
  align-self: flex-start;
`;

const UserLabel = styled(NameLabel)`
  color: #9DC6C0;
  align-self: flex-end;
`;

export function Message({ chatState, isUserMessage, messageType, stateSetters, phase, children }) {
  let content;

  switch (messageType) {
    case (MESSAGE_TYPES.DESIGN_SELECTION):
        content = <DesignSelection chatState={chatState} stateSetters={stateSetters} phase={phase} />
      break;
    default:
      content = <ReactMarkdown>{children}</ReactMarkdown>
      break;
  }

  const nameLabel = isUserMessage ?
    <UserLabel>YOU</UserLabel> :
    <BotLabel>LIGHTBOT</BotLabel>;
  const MessageComponent = isUserMessage ? UserMessage : BotMessage;

  return (
    <>
      {nameLabel}
      <MessageComponent>
        {content}
      </MessageComponent>
    </>
  );
};
