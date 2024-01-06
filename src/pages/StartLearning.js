import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
//import styled from "styled-components";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { useParams } from "react-router-dom";
import QuestionComponent from "../components/QuestionComponent";

const StartLearning = () => {
  const [questions, setQuestions] = useState([]);
  const questionsCollectionRef = collection(db, "questions");
  let question = "";
  let answers = [];
  let rightAnswer = "";
  let questionId = "";

  useEffect(() => {
    const getQuestions = async () => {
      const data = await getDocs(questionsCollectionRef);
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getQuestions();
  }, []);

  if (questions.length > 0) {
    const sortedQuestions = questions
      .slice()
      .sort((a, b) => a.showQAskA - b.showQAskA);

    const questionSliceIndex = Math.floor(
      Math.random() * sortedQuestions.length + 1
    );

    console.log(questionSliceIndex);

    const questionsToLearn = sortedQuestions.slice(0, questionSliceIndex);

    console.log(questionsToLearn);

    const questionIndex = Math.floor(Math.random() * questionSliceIndex);

    console.log(questionIndex);

    const wrongAnswers = questionsToLearn[questionIndex].wrongA
      .split(",")
      .map(function (item) {
        return item.trim();
      });

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
    />
  );
};

export default StartLearning;
