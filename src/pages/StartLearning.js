import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import QuestionComponent from "../components/QuestionComponent";

const StartLearning = () => {
  const [questions, setQuestions] = useState([]);
  const [avoidedQuestions, setAvoidedQuestions] = useState([]);
  const questionsCollectionRef = collection(db, "questions");
  let question = "";
  let answers = [];
  let rightAnswer = "";
  let questionId = "";
  let showQAskA,
    countAsked,
    countRight,
    showAAskQ = 0;

  useEffect(() => {
    const getQuestions = async () => {
      const data = await getDocs(questionsCollectionRef);
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getQuestions();
  }, []);

  if (questions.length > 0) {
    const sortedQuestions = questions
      .filter((obj) => !avoidedQuestions.includes(obj.q))
      .slice()
      .sort((a, b) => a.showQAskA - b.showQAskA);

    const questionSliceIndex = Math.floor(
      Math.random() * sortedQuestions.length + 1
    );

    //console.log(questionSliceIndex);

    const questionsToLearn = sortedQuestions.slice(0, questionSliceIndex);
    //console.log(questionsToLearn);

    const questionIndex = Math.floor(Math.random() * questionsToLearn.length);

    //console.log(questionIndex);

    const questionToLearnSubject = questionsToLearn[questionIndex].subject;
    const otherQuestionsOfSubjectAsked = questions
      .filter((obj) => obj.subject === questionToLearnSubject)
      .filter((obj) => obj.q !== questionsToLearn[questionIndex].q);

    let wrongAnswers = [];

    if (otherQuestionsOfSubjectAsked.length > 3) {
      wrongAnswers = otherQuestionsOfSubjectAsked
        .map((obj) => obj.a)
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0, 4);
    } else {
      wrongAnswers = questionsToLearn[questionIndex].wrongA
        .split(",")
        .map(function (item) {
          return item.trim();
        });
    }

    showQAskA = questionsToLearn[questionIndex].showQAskA;
    countAsked = questionsToLearn[questionIndex].countAsked;
    countRight = questionsToLearn[questionIndex].countRight;
    showAAskQ = questionsToLearn[questionIndex].showAAskQ;

    question = questionsToLearn[questionIndex].q;
    rightAnswer = questionsToLearn[questionIndex].a;
    questionId = questionsToLearn[questionIndex].id;
    answers = [...wrongAnswers, questionsToLearn[questionIndex].a]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  return (
    <QuestionComponent
      question={question}
      answers={answers}
      rightAnswer={rightAnswer}
      questionId={questionId}
      showQAskA={showQAskA}
      countAsked={countAsked}
      countRight={countRight}
      showAAskQ={showAAskQ}
      avoidedQuestions={avoidedQuestions}
      setAvoidedQuestions={setAvoidedQuestions}
    />
  );
};

export default StartLearning;
