import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  documentId,
} from "firebase/firestore";
import { db } from "../firebase-config";

const EditQuestion = () => {
  const StyledTablePage = styled.div`
  //display: flex;
  margin-right:30px;
  margin-top: 20px
  //justify-content: center;
  // align-items: top;
  height: 100vh;
  margin: 0;
  align-self: flex-end;
  width: auto;
`;

  const StyledTable = styled.table`
    border-collapse: collapse;
    width: 80%;
    margin-top: 20px;
    width: auto;
  `;

  const StyledTableCell = styled.td`
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    width: auto;
  `;

  const StyledTableHeader = styled.th`
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    background-color: #f2f2f2;
    width: auto;
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

  const FlexibleTextarea = styled.textarea`
    flex: 1; // This makes the textarea flexibly grow to fill available space
    min-height: 1px; // Set a minimum height to prevent it from collapsing to zero
    resize: none; // Prevent users from manually resizing the textarea
    border: 1px solid black;
    padding: 8px;
  `;

  const { QuestionId } = useParams();
  //const [question, setQuestion] = useState({});
  const navigate = useNavigate();
  const questionsCollectionRef = collection(db, "questions");

  const [q, setQ] = useState();
  const [a, setA] = useState();
  const [subject, setSubject] = useState();
  const [showAAskQ, setshowAAskQ] = useState();
  const [showQAskA, setshowQAskA] = useState();
  const [wrongA, setwrongA] = useState();
  const [countAsked, setcountAsked] = useState();
  const [countRight, setcountRight] = useState();

  useEffect(() => {
    const getQuestion = async () => {
      const q = query(
        questionsCollectionRef,
        where(documentId(), "in", [QuestionId])
      );
      const data = await getDocs(q);

      if (data.docs.length > 0) {
        const questionData = data.docs[0].data();
        //setQuestion({ ...questionData, id: data.docs[0].id });
        setQ(questionData.q);
        setA(questionData.a);
        setSubject(questionData.subject);
        setshowAAskQ(questionData.showAAskQ);
        setshowQAskA(questionData.showQAskA);
        setwrongA(questionData.wrongA);
        setcountAsked(questionData.countAsked);
        setcountRight(questionData.countRight);
      }
    };

    getQuestion();
  }, []);

  const [subjects, setSubjects] = useState([]);
  const subjectsCollectionRef = collection(db, "subjects");

  useEffect(() => {
    const getSubjects = async () => {
      const data = await getDocs(subjectsCollectionRef);
      setSubjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getSubjects();
  }, []);

  const EditQuestion = async (id) => {
    const questionDoc = doc(db, "questions", id);
    const newField = {
      q: q,
      a: a,
      subject: subject,
      showAAskQ: showAAskQ,
      showQAskA: showQAskA,
      wrongA: wrongA,
      countAsked: countAsked,
      countRight: countRight,
    };
    await updateDoc(questionDoc, newField);
    navigate("/AllQuestions");
  };

  return (
    <StyledTablePage>
      <StyledTable>
        <thead>
          <tr>
            <StyledTableHeader colSpan="2">
              Editați Întrebarea
            </StyledTableHeader>
          </tr>
        </thead>
        <tr>
          <StyledTableHeader>Intrebare</StyledTableHeader>
          <StyledTableCell>
            <FlexibleTextarea
              type="text"
              defaultValue={q}
              id=""
              onBlur={(e) => {
                setQ(e.target.value);
                e.target.style.height = "auto"; // Reset the height to auto
                e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to the scrollHeight
              }}
            />
          </StyledTableCell>
        </tr>
        <tr>
          <StyledTableHeader>Răspuns</StyledTableHeader>
          <StyledTableCell>
            <FlexibleTextarea
              type="text"
              defaultValue={a}
              id=""
              onBlur={(e) => {
                setA(e.target.value);
              }}
            />
          </StyledTableCell>
        </tr>
        <tr>
          <StyledTableHeader>Materie</StyledTableHeader>
          <StyledTableCell>
            <select
              defaultValue={subject}
              onBlur={(e) => setSubject(e.target.value)}
            >
              {subjects.map((row) => (
                <option value={row.subjectName} key={row.id}>
                  {row.subjectName}
                </option>
              ))}
            </select>
          </StyledTableCell>
        </tr>
        <tr>
          <StyledTableHeader>Nivel de Cunoaștere</StyledTableHeader>
          <StyledTableCell>
            <FlexibleTextarea
              type="text"
              defaultValue={Math.round((showAAskQ + showQAskA) / 2) + "%"}
              id=""
              onBlur={(e) => {
                setshowAAskQ(Number(e.target.value));
                setshowQAskA(Number(e.target.value));
              }}
            />
          </StyledTableCell>
        </tr>
        <tr>
          <StyledTableHeader>Variante Greșite</StyledTableHeader>
          <StyledTableCell>
            <FlexibleTextarea
              type="text"
              defaultValue={wrongA}
              id=""
              onBlur={(e) => {
                setwrongA(e.target.value);
              }}
            />
          </StyledTableCell>
        </tr>
        <tr>
          <StyledTableHeader>Răspunsuri date</StyledTableHeader>
          <StyledTableCell>
            <FlexibleTextarea
              type="text"
              defaultValue={countAsked}
              id=""
              onBlur={(e) => {
                setcountAsked(Number(e.target.value));
              }}
            />
          </StyledTableCell>
        </tr>
        <tr>
          <StyledTableHeader>Răspunsuri date Corect</StyledTableHeader>
          <StyledTableCell>
            <FlexibleTextarea
              type="text"
              defaultValue={countRight}
              id=""
              onBlur={(e) => {
                setcountRight(
                  e.target.value <= countAsked
                    ? Number(e.target.value)
                    : Number(countAsked)
                );
              }}
            />
          </StyledTableCell>
        </tr>
      </StyledTable>{" "}
      <StyledSubmit onClick={() => EditQuestion(QuestionId)}>
        Confirm
      </StyledSubmit>
      <StyledSkip onClick={() => navigate("/overview")}>Anulare</StyledSkip>
    </StyledTablePage>
  );
};

export default EditQuestion;
