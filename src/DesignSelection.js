import { useState } from 'react';
import styled from 'styled-components';

import { PHASES } from './constants';
import { getPrompt } from './promptTemplates';

const SubmitButton = styled.button`
  width: 100px;
  margin-top: 4px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TextRow = styled.div`
  display: inline-flex;
  align-items: center;
`;

const ImageRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const DesignSelection = ({ chatState, phase, stateSetters }) => {
  const [selections, setSelections] = useState({});

  const { designSuggestions, images, suggestionNames } = chatState;

  return <Container>
    <div>Great! I've come up with the following design inspirations for you.</div>
    {
      ['design_ideas', 'interior_designers', 'artists'].map(key => (
        <>
          <div style={{ marginTop: '10px' }}><strong>{key.replace('_', ' ').toUpperCase()}:</strong></div>
          {
            designSuggestions[key].map((item, i) => (
              <>
                <TextRow>
                  <input
                    type="checkbox"
                    disabled={phase !== PHASES.DESIGN_SELECTION}
                    onChange={(e) => setSelections(prev => ({ ...prev, [item.name]: e.target.checked }))}
                  />
                  <span>{i+1}. <strong>{item.name}</strong>: {item.explanation}</span>
                </TextRow>
                {
                  suggestionNames.includes(item.name) ?
                  <ImageRow>
                    {images[item.name].map((image, j) => (
                      <img src={image} height={200} alt={`${item.name}${j}`} />
                    ))}
                  </ImageRow> :
                  null
                }
              </>
            ))
          }
        </>
      ))
    }
    <SubmitButton
      disabled={!Object.values(selections).includes(true) || phase !== PHASES.DESIGN_SELECTION}
      onClick={() => {
        const { setLoading, setMessages, setChatState, setPhase } = stateSetters;

        const selectedDesigns = Object.entries(selections).filter(([_, value]) => !!value).map(key => key);
        const selectedString = selectedDesigns.join(', ');

        setLoading(true);
        fetch(`${process.env.REACT_APP_BACKEND_URL}/gpt-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ ...chatState, message: getPrompt(PHASES.DESIGN_SELECTION, [selectedString]) }),
        })
          .then((res) => res.json())
          .then((data) => {
            const { message, ...state } = data;
            const designExplanationFormatted = message.replace('\n', ' ');
            setLoading(false);
            setMessages(prev => ([
              ...prev,
              { fromUser: false, content: message },
              { fromUser: false, content: 'Now, please provide a text description of your space.' },
            ]));
            setChatState(prev => ({ ...prev, ...state, designExplanationFormatted, selectedDesigns }));
            setPhase(PHASES.SPACE_DESCRIPTION);
          });
      }}
    >
      Submit
    </SubmitButton>
  </Container>
}
