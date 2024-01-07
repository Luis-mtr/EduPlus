import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

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

const QuestionComponent = ({
  question,
  answers,
  rightAnswer,
  questionId,
  countAsked,
  countRight,
  showAAskQ,
  showQAskA,
  avoidedQuestions,
  setAvoidedQuestions,
}) => {
  const [activeAnswer, setActiveAnswer] = useState([]);
  const [isCorrect, setIsCorrect] = useState("");
  const navigate = useNavigate();

  const confirm = () => {
    if (activeAnswer[1] === rightAnswer) {
      setIsCorrect("Correct");
    } else {
      setIsCorrect("Incorrect");
    }
  };

  const nextQuestionCorrect = async (id) => {
    const questionDoc = doc(db, "questions", id);
    const newField = {
      countAsked: countAsked + 1,
      countRight: countRight + 1,
      showAAskQ: showAAskQ / 2 + 50,
      showQAskA: showQAskA / 2 + 50,
    };
    await updateDoc(questionDoc, newField);

    setAvoidedQuestions([...avoidedQuestions, question].slice(-4));
    setIsCorrect("");
    setActiveAnswer([]);
    navigate("/StartLearning");
  };

  const nextQuestionIncorrect = async (id) => {
    const questionDoc = doc(db, "questions", id);
    const newField = {
      countAsked: countAsked + 1,

      showAAskQ: showAAskQ / 2,
      showQAskA: showQAskA / 2,
    };
    await updateDoc(questionDoc, newField);

    setAvoidedQuestions([...avoidedQuestions, question].slice(-4));
    setIsCorrect("");
    setActiveAnswer([]);
    navigate("/StartLearning");
  };

  const reset = () => {
    navigate("/StartLearning");
    setIsCorrect("");
    setActiveAnswer([]);
  };

  const edit = () => {
    navigate("/EditQuestion/" + questionId);
  };

  return isCorrect === "Correct" ? (
    <div>
      <h1>Corect!</h1>
      <StyledSkip onClick={() => nextQuestionCorrect(questionId)}>
        Continuă
      </StyledSkip>
    </div>
  ) : isCorrect === "Incorrect" ? (
    <div>
      <h1>Greșit!!</h1>
      <h2>Raspunsul corect era {rightAnswer}</h2>
      <StyledSkip onClick={() => nextQuestionIncorrect(questionId)}>
        Continuă
      </StyledSkip>
    </div>
  ) : (
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
      <StyledSubmit onClick={confirm}>Confirmă răspuns</StyledSubmit>
      <StyledSkip onClick={reset}>Altă întrebare</StyledSkip>
      <StyledEdit onClick={edit}>Modifică întrebarea</StyledEdit>
    </div>
  );
};

export default QuestionComponent;
