import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase-config";

const StyledTablePage = styled.div`
  //display: flex;
  margin-right:30px;
  margin-top: 20px
  //justify-content: center;
  // align-items: top;
  height: 100vh;
  margin: 0;
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 80%;
  margin-top: 20px;
`;

const StyledTableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const StyledTableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  background-color: #f2f2f2;
`;

const StyledButton = styled.button`
  margin-top: 10px;
  align-self: flex-end;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const subjectsCollectionRef = collection(db, "subjects");

  useEffect(() => {
    const getSubjects = async () => {
      const data = await getDocs(subjectsCollectionRef);
      setSubjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getSubjects();
  }, []);

  const [questions, setQuestions] = useState([]);
  const questionsCollectionRef = collection(db, "questions");
  useEffect(() => {
    const getQuestions = async () => {
      const data = await getDocs(questionsCollectionRef);
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getQuestions();
  }, []);

  const [newSubject, setNewSubject] = useState("");

  const createSubject = async () => {
    await addDoc(subjectsCollectionRef, { subjectName: newSubject });
    window.location.reload();
  };

  const deleteSubject = async (id) => {
    const subjectDoc = doc(db, "subjects", id);
    await deleteDoc(subjectDoc);
    window.location.reload();
  };

  // const resetSubject = async (subject) => {
  //   const questionDoc = doc(db, "questions", subject);
  //   const newField = {
  //     countAsked: 0,
  //     countRight: 0,
  //     showAAskQ: 50,
  //     showQAskA: 50,
  //   };
  //   await updateDoc(questionDoc, newField);
  // };

  let sortedSubjects = subjects
    .slice()
    .sort((a, b) => a.subjectName.localeCompare(b.subjectName));

  return (
    <StyledTablePage>
      <StyledTable>
        <thead>
          <tr>
            <StyledTableHeader colSpan="5">
              <h1>Tabel de Materii</h1>
            </StyledTableHeader>
          </tr>
          <tr>
            <StyledTableHeader>Nr. Crt.</StyledTableHeader>
            <StyledTableHeader>Subiect</StyledTableHeader>
            <StyledTableHeader>Nr. Întrebări</StyledTableHeader>
            <StyledTableHeader>Nivel de Cunoaștere</StyledTableHeader>
            <StyledTableHeader>Del.</StyledTableHeader>
          </tr>
        </thead>
        <tbody>
          {sortedSubjects.map((row) => (
            <tr key={row.id}>
              <StyledTableCell>
                {sortedSubjects.indexOf(row) + 1}
              </StyledTableCell>
              <StyledTableCell>{row.subjectName}</StyledTableCell>
              <StyledTableCell>
                {
                  questions.filter((obj) => obj.subject === row.subjectName)
                    .length
                }
              </StyledTableCell>
              <StyledTableCell>
                {questions.filter((obj) => obj.subject === row.subjectName)
                  .length > 0
                  ? Math.round(
                      Number(
                        questions
                          .filter((obj) => obj.subject === row.subjectName)
                          .reduce(
                            (acc, obj) => acc + obj.showAAskQ + obj.showQAskA,
                            0
                          )
                      ) /
                        2 /
                        Number(
                          questions.filter(
                            (obj) => obj.subject === row.subjectName
                          ).length
                        )
                    ) + "%"
                  : "0%"}
              </StyledTableCell>
              <StyledTableCell>
                <button
                  onClick={() => {
                    const subjectQuestions = questions.filter(
                      (obj) => obj.subject === row.subjectName
                    );

                    if (subjectQuestions.length > 0) {
                      alert(
                        "Acest subiect are întrebări. Ștergerea subiectului este posibilă doar după ștergerea acestor întrebări."
                      );
                    } else {
                      const userConfirmed = window.confirm(
                        "Ești sigur că vrei să ștergi subiectul?"
                      );

                      if (userConfirmed) {
                        deleteSubject(row.id);
                      }
                    }
                  }}
                >
                  ❌
                </button>
              </StyledTableCell>
            </tr>
          ))}
          <tr>
            <StyledTableCell>{sortedSubjects.length + 1}</StyledTableCell>
            <StyledTableCell>
              <input
                type="text"
                placeholder="Subiect nou..."
                id=""
                onChange={(e) => {
                  setNewSubject(e.target.value);
                }}
              />
            </StyledTableCell>
            <StyledTableCell>0</StyledTableCell>
            <StyledTableCell>0%</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </tr>
        </tbody>
        <StyledButton onClick={createSubject}>Adaugă Subiect</StyledButton>
      </StyledTable>
    </StyledTablePage>
  );
};

export default Subjects;
