import React from "react";
import styled from "styled-components";

const QuestionContainer = styled.div`
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const QuestionText = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const AnswerOption = styled.div`
  margin-bottom: 10px;
`;

const AnswerInput = styled.input.attrs({ type: "radio" })`
  margin-right: 10px;
`;

const AnswerLabel = styled.label`
  font-size: 16px;
`;

const QuestionComponent = ({ question, answers }) => {
  return (
    <QuestionContainer>
      <QuestionText>{question}</QuestionText>
      {answers.map((answer, index) => (
        <AnswerOption key={index}>
          <AnswerInput id={`answer${index}`} name="answer" />
          <AnswerLabel htmlFor={`answer${index}`}>{answer}</AnswerLabel>
        </AnswerOption>
      ))}
    </QuestionContainer>
  );
};

export default QuestionComponent;
