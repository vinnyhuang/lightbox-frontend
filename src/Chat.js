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

const INITIAL_HISTORY = [
  [
    "Take the function of an interior designer.  Your design work draws inspiration from eclectic sources. You specialize in designing to display culture and create meaningful ambiances. You have a special focus on lighting including unique floor and table lamps, wall and ceiling fixtures and accent lights. I am your client and you are determining the creative direction for my project. Ask me a few open ended questions about my design preferences to understand my tastes. Your goal is to use my answers to these questions to brainstorm ideas for my space and list potential designers or artists (they don't have to be just interior designers) from whom we can draw inspiration.",
    "Of course! Let's embark on this journey to create a space that is both unique and deeply meaningful. To help guide the design process, I'd love to delve into your personal tastes and preferences. Here are some open-ended questions to get us started: 1. Narrative and History: Are there specific stories, histories, or cultures you want the space to resonate with or draw upon? 2. Colors and Emotions: How do you want to feel when you walk into the space? Are there any specific colors that evoke these emotions for you? 3. Functionality vs Aesthetics: While aesthetics is a significant part, how do you envision the functionality of the space? For instance, should it prioritize comfort, utility, showcasing art, or something else? 4. Luminosity: Lighting is an art in itself. Do you prefer a brightly lit space with multiple light sources, or are you drawn more towards moodier, dimly lit ambiances? 5. Artistic Inspirations: Are there any artists, films, books, or locations that resonate deeply with you? It can be in terms of color, mood, narrative, or even specific elements and patterns. 6. Unique Light Fixtures: Given the emphasis on lighting, do you have a preference for modern, antique, rustic, or any other specific style when it comes to your lighting fixtures? 7. Objects and Elements: Are there any particular objects, materials, or elements you want incorporated into the design, like heirlooms, specific textiles, or crafts? Based on your answers to the above, I'll be better positioned to brainstorm ideas for your space and suggest designers or artists for inspiration. After the Client's Responses: Brainstorm Ideas: 1. If the client is drawn to Middle Eastern cultures, consider intricate lantern designs, plush textiles, and deep warm colors. 2. For a more modern look inspired by artists like James Turrell, play with color gradients and unique light installations. 3. If the preference is towards natural and rustic, draw from artists like Andy Goldsworthy. Use elements like driftwood lamps, or lights encased in natural materials. Potential Designers/Artists for Inspiration: 1. Frida Kahlo: Her use of vibrant colors and culturally rich motifs can serve as an inspiration for textiles and wall art. 2. Zaha Hadid: Known for her futuristic designs, she brings a unique perspective to spaces that can influence the choice of light fixtures and room layouts. 3. Gio Ponti: His eclectic designs from furniture to lighting can add a touch of vintage and modern fusion. 4. Olafur Eliasson: A contemporary artist known for his large-scale installations, especially those involving light and color. His work can inspire unique lighting experiences within the space. 5. Isamu Noguchi: Famous for his iconic Akari light sculptures, they can be a great addition if you're looking to bring softness and a touch of nature inside. Remember, this space is a canvas that tells a story. Your story. The amalgamation of various influences will ensure it's both unique and deeply meaningful to you."
  ]
];

const questionnaireContent = `
Great! Let's embark on this journey to create a space that is both unique and deeply meaningful. To help guide the design process, I'd love to delve into your personal tastes and preferences. Here are some open-ended questions to get us started:

1. **Narrative and History:** Are there specific stories, histories, or cultures you want the space to resonate with or draw upon?

2. **Colors and Emotions:** How do you want to feel when you walk into the space? Are there any specific colors that evoke these emotions for you?

3. **Functionality vs Aesthetics:** While aesthetics is a significant part, how do you envision the functionality of the space? For instance, should it prioritize comfort, utility, showcasing art, or something else?

4. **Luminosity:** Lighting is an art in itself. Do you prefer a brightly lit space with multiple light sources, or are you drawn more towards moodier, dimly lit ambiances?

5. **Artistic Inspirations:** Are there any artists, films, books, or locations that resonate deeply with you? It can be in terms of color, mood, narrative, or even specific elements and patterns.

6. **Unique Light Fixtures:** Given the emphasis on lighting, do you have a preference for modern, antique, rustic, or any other specific style when it comes to your lighting fixtures?

7. **Objects and Elements:** Are there any particular objects, materials, or elements you want incorporated into the design, like heirlooms, specific textiles, or crafts?

Based on your answers to the above, I'll be better positioned to brainstorm ideas for your space and suggest designers or artists for inspiration.
`;

// const questionnaireContent = "Of course! Let's embark on this journey to create a space that is both unique and deeply meaningful. To help guide the design process, I'd love to delve into your personal tastes and preferences. Here are some open-ended questions to get us started:\n1. **Narrative and History:** Are there specific stories, histories, or cultures you want the space to resonate with or draw upon?\n2. **Colors and Emotions:** How do you want to feel when you walk into the space? Are there any specific colors that evoke these emotions for you?\n3. **Functionality vs Aesthetics:** While aesthetics is a significant part, how do you envision the functionality of the space? For instance, should it prioritize comfort, utility, showcasing art, or something else?\n4. **Luminosity:** Lighting is an art in itself. Do you prefer a brightly lit space with multiple light sources, or are you drawn more towards moodier, dimly lit ambiances?\n5. **Artistic Inspirations:** Are there any artists, films, books, or locations that resonate deeply with you? It can be in terms of color, mood, narrative, or even specific elements and patterns.\n6. **Unique Light Fixtures:** Given the emphasis on lighting, do you have a preference for modern, antique, rustic, or any other specific style when it comes to your lighting fixtures?\n7. **Objects and Elements:** Are there any particular objects, materials, or elements you want incorporated into the design, like heirlooms, specific textiles, or crafts?\n\nBased on your answers to the above, I'll be better positioned to brainstorm ideas for your space and suggest designers or artists for inspiration.";

// const moreInfoContent = 'Anything other information you\'d like to add about your tastes or details of your project?';

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
  console.log('chatState', chatState);
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
              // setLoading(true);
              // fetch("/gpt-chat", {
              //   method: 'POST',
              //   headers: { 'Content-Type': 'application/json; charset=utf-8' },
              //   body: JSON.stringify({ ...chatState, message: getPrompt(PHASES.TYPE_OF_SPACE) }),
              // })
              //   .then((res) => res.json())
              //   .then((data) => {
              //     const { message, ...state } = data;
              //     setLoading(false);
              //     setMessages(prev => ([...prev, { fromUser: false, content: message, messageType: MESSAGE_TYPES.QUESTIONNAIRE }]));
              //     setChatState(prev => ({ ...prev, ...state, typeOfSpace: userMessage, questions: JSON.parse(message) }));
              //     setPhase(PHASES.QUESTIONNAIRE);
              //   });
              setMessages(prev => ([...prev, { fromUser: false, content: questionnaireContent, /* messageType: MESSAGE_TYPES.QUESTIONNAIRE2 */ }]));
              setChatState(prev => ({ ...prev, typeOfSpace: userMessage }));
              setPhase(PHASES.QUESTIONNAIRE2);
              break;
              case PHASES.QUESTIONNAIRE2:
                setLoading(true);
                fetch("/gpt-chat", {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json; charset=utf-8' },
                  body: JSON.stringify({ ...chatState, message: getPrompt(PHASES.QUESTIONNAIRE2, [userMessage]) }),
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
                          // items.forEach(item => {
                          //   itemNames.push(item.name);
                          //   searchTerms.push(`item.name`);
                          // });
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
            // case PHASES.QUESTIONNAIRE2:
            //   setMessages(prev => ([...prev, { fromUser: false, content: moreInfoContent }]));
            //   setChatState(prev => ({ ...prev, answers: userMessage }));
            //   setPhase(PHASES.MORE_DETAILS);
            //   break;
            // case PHASES.MORE_DETAILS:
            //   setLoading(true);
            //   fetch("/gpt-chat", {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json; charset=utf-8' },
            //     body: JSON.stringify({ ...chatState, message: getPrompt(PHASES.MORE_DETAILS, [chatState.answers, userMessage]) }),
            //   })
            //     .then((res) => res.json())
            //     .then((data) => {
            //       const { message, ...state } = data;
            //       setLoading(false);
            //       setMessages(prev => ([...prev, { fromUser: false, content: message, messageType: MESSAGE_TYPES.DESIGN_IMAGES }]));
            //       setChatState(prev => ({ ...prev, ...state, /* designers: JSON.parse(message) */ }));
            //       setPhase(PHASES.DESIGN_IMAGES);
            //     });
            //   break
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
