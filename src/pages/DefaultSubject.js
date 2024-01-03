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
import { useParams } from "react-router-dom";

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

const DefaultSubject = () => {
  const [questions, setQuestions] = useState([]);
  const questionsCollectionRef = collection(db, "questions");
  const { subject } = useParams();

  useEffect(() => {
    const getQuestions = async () => {
      const data = await getDocs(questionsCollectionRef);
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getQuestions();
  }, []);

  let pageQuestions = questions.filter((obj) => obj.subject === subject);
  // .sort((a, b) => a.subjectName.localeCompare(b.subjectName));

  return (
    <StyledTablePage>
      <StyledTable>
        <thead>
          <tr>
            <StyledTableHeader colSpan="7">
              <h1>{subject}</h1>
            </StyledTableHeader>
          </tr>
          <tr>
            <StyledTableHeader>Nr. Crt.</StyledTableHeader>
            <StyledTableHeader>Întrebare</StyledTableHeader>
            <StyledTableHeader>Răspuns</StyledTableHeader>
            <StyledTableHeader>Nivel de Cunoaștere</StyledTableHeader>
            <StyledTableHeader>Variante Greșite</StyledTableHeader>
            <StyledTableHeader>Răspunsuri date</StyledTableHeader>
            <StyledTableHeader>Răspunsuri corect</StyledTableHeader>
          </tr>
        </thead>
        <tbody>
          {pageQuestions.map((row) => (
            <tr key={row.id}>
              <StyledTableCell>
                {pageQuestions.indexOf(row) + 1}
              </StyledTableCell>
              <StyledTableCell>{row.q}</StyledTableCell>
              <StyledTableCell>{row.a}</StyledTableCell>
              <StyledTableCell>
                {Math.round((row.showAAskQ + row.showQAskA) / 2) + "%"}
              </StyledTableCell>
              <StyledTableCell>{row.wrongA}</StyledTableCell>
              <StyledTableCell>{row.countAsked}</StyledTableCell>
              <StyledTableCell>
                {row.countAsked > 0
                  ? Math.round(
                      (Number(row.countRight) / Number(row.countAsked)) * 100
                    ) + "%"
                  : "0%"}
              </StyledTableCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledTablePage>
  );
};

export default DefaultSubject;
