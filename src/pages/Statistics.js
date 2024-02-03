import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase-config";

const Statistics = () => {
  const [questions, setQuestions] = useState([]);
  const questionsCollectionRef = collection(db, "questions");

  useEffect(() => {
    const getQuestions = async () => {
      const data = await getDocs(questionsCollectionRef);
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getQuestions();
  }, []);

  const distinctSubjects = [
    ...new Set(questions.map((question) => question.subject)),
  ];

  const totalCountAsked = questions.reduce(
    (total, question) => Number(total) + Number(question.countAsked),
    0
  );

  const totalCountRight = questions.reduce(
    (total, question) => Number(total) + Number(question.countRight),
    0
  );

  const totalShowAAskQ = questions.reduce(
    (total, question) =>
      Number(total) +
      Number(question.showAAskQ) / 2 +
      Number(question.showQAskA) / 2,
    0
  );

  return (
    <div className="home">
      <h1>
        EduPlus
        <br />
      </h1>

      <p className="info">
        <br />
        Statistici:
        <br /> <br />
        Sunt {questions.length} întrebări
        <br />
        <br />
        Grupate în {distinctSubjects.length} materii
        <br />
        <br />
        Au fost date {totalCountAsked} de răspunsuri
        <br />
        <br />
        Din care {Math.floor((totalCountRight * 100) / totalCountAsked)}%
        corecte
        <br />
        <br />
        Nivelul mediu de cunoaștere a întrebărilor este{" "}
        {Math.floor(totalShowAAskQ / questions.length)}%
      </p>
    </div>
  );
};

export default Statistics;
