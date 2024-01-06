import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

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

const StyledOption = styled.button`
  margin-top: 10px;
  align-self: flex-end;
  padding: 10px;
  background-color: ${({ index, activeAnswer }) =>
    index === activeAnswer ? "#4caf50" : "white"};
  color: ${({ index, activeAnswer }) =>
    index === activeAnswer ? "white" : "#4caf50"};
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const StyledSubmit = styled.button`
  margin-top: 10px;
  align-self: flex-end;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
`;

const StyledSkip = styled.button`
  margin-top: 10px;
  align-self: flex-end;
  padding: 10px;
  background-color: #d2222d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
`;

const StyledEdit = styled.button`
  margin-top: 10px;
  align-self: flex-end;
  padding: 10px;
  background-color: #ffbf00;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
`;

const QuestionComponent = ({ question, answers, rightAnswer, questionId }) => {
  const [activeAnswer, setActiveAnswer] = useState([]);
  const navigate = useNavigate();

  const reset = () => {
    navigate("/StartLearning");
  };

  const edit = () => {
    navigate("/EditQuestions/" + questionId);
  };

  return (
    <div>
      <QuestionContainer>
        <QuestionText>{question}</QuestionText>
        {answers.map((answer, index) => (
          <div>
            <StyledOption
              index={index}
              activeAnswer={activeAnswer[0]}
              onClick={() => setActiveAnswer([index, answer])}
            >
              {answer}
            </StyledOption>
          </div>
        ))}
      </QuestionContainer>
      <StyledSubmit>Confirmă răspuns</StyledSubmit>
      <StyledSkip onClick={reset}>Altă întrebare</StyledSkip>
      <StyledEdit onClick={edit}>Modifică întrebarea</StyledEdit>
    </div>
  );
};

export default QuestionComponent;
