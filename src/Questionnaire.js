import { useState } from 'react';
import styled from 'styled-components';

const N_QUESTIONS = 10;
const N_CHOICES = 5;
const N_DATA_ITEMS = N_CHOICES + 1;

const QuestionBlock = styled.div`
  margin: 4px 0;
`;

const OptionBlock = styled.div`
  margin: 2px 0;
`;

const OptionButton = styled.button`
  width: 30px;
  margin-right: 4px;
  background-color: ${({ selected }) => selected ? '#C76383' : '#DDD'};
`;

const SubmitButton = styled.button`
  width: 100px;
  margin-top: 4px;
`;

const Question = ({ question, options, selection, setSelection }) => {
  return <QuestionBlock>
    <div>{question}</div>
    {options.map((option, i) => (
      <OptionBlock>
        <OptionButton
          selected={selection === i}
          onClick={() => setSelection(i)}
        >
          {String.fromCharCode(65 + i)}
        </OptionButton>
        {option}
      </OptionBlock>
    ))}
  </QuestionBlock>
}

export const Questionnaire = ({ questionsDataRaw, onSubmit }) => {
  const [selections, setSelections] = useState({});

  const questions = [];
  for (let i = 0; i < N_QUESTIONS; i++) {
    questions.push([
      questionsDataRaw[i * N_DATA_ITEMS],
      questionsDataRaw.slice(i * N_DATA_ITEMS + 1, i * N_DATA_ITEMS + N_DATA_ITEMS),
    ]);
  }

  return <>
    {questions.map((questionData, i) => (
      <Question
        question={questionData[0]}
        options={questionData[1]}
        selection={selections[i]}
        setSelection={(s) => setSelections(prev => ({ ...prev, [i]: s }))}
      />
    ))}
    <SubmitButton
      disabled={Object.keys(selections).length < N_QUESTIONS}
      onClick={() => {
        let responseString = '';
        for (let i = 0; i < N_QUESTIONS; i++) {
          responseString += `${i + 1}. ${String.fromCharCode(65 + selections[i])} `;
        }
        onSubmit(responseString);
      }}
    >
      Submit
    </SubmitButton>
  </>
}
