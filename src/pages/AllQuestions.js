import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
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
  align-self: flex-end;
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
  const [order, setOrder] = useState("ascIntr");
  // const { subject } = useParams();

  useEffect(() => {
    const getQuestions = async () => {
      let q = null;
      if (order === "ascIntr") {
        q = query(questionsCollectionRef, orderBy("q", "asc"));
      }
      if (order === "descIntr") {
        q = query(questionsCollectionRef, orderBy("q", "desc"));
      }

      const data = await getDocs(q);
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getQuestions();
  }, []);

  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [newWrongA, setNewWrongA] = useState("");
  const [newSubject, setNewSubject] = useState("");

  const createQuestion = async () => {
    await addDoc(questionsCollectionRef, {
      subject: newSubject,
      q: newQ,
      a: newA,
      wrongA: newWrongA,
      countAsked: 0,
      countRight: 0,
      dateLastAsked: Date(),
      dateNextAsk: Date(),
      showAAskQ: 50,
      showQAskA: 50,
    });
    window.location.reload();
  };

  const deleteQuestion = async (id) => {
    const questionDoc = doc(db, "questions", id);
    await deleteDoc(questionDoc);
    window.location.reload();
  };

  const questionReset = async (id) => {
    const questionDoc = doc(db, "questions", id);
    const newField = {
      countAsked: 0,
      countRight: 0,
      showAAskQ: 50,
      showQAskA: 50,
    };
    await updateDoc(questionDoc, newField);
    window.location.reload();
  };

  const [subjects, setSubjects] = useState([]);
  const subjectsCollectionRef = collection(db, "subjects");

  useEffect(() => {
    const getSubjects = async () => {
      const data = await getDocs(subjectsCollectionRef);
      setSubjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getSubjects();
  }, []);

  const sortedQuestions = React.useMemo(() =>
    order === "ascIntr"
      ? questions.slice().sort((a, b) => a.q.localeCompare(b.q))
      : order === "descIntr"
      ? questions.slice().sort((b, a) => a.q.localeCompare(b.q))
      : order === "ascRsp"
      ? questions.slice().sort((a, b) => a.a.localeCompare(b.a))
      : order === "descRsp"
      ? questions.slice().sort((b, a) => a.a.localeCompare(b.a))
      : order === "ascNiv"
      ? questions.slice().sort((a, b) => {
          const sumA = Number(a.showAAskQ) + Number(a.showQAskA);
          const sumB = Number(b.showAAskQ) + Number(b.showQAskA);

          return sumA - sumB;
        })
      : order === "descNiv"
      ? questions.slice().sort((a, b) => {
          const sumA = Number(a.showAAskQ) + Number(a.showQAskA);
          const sumB = Number(b.showAAskQ) + Number(b.showQAskA);

          return sumB - sumA;
        })
      : order === "ascRD"
      ? questions.slice().sort((a, b) => a.countAsked - b.countAsked)
      : order === "descRD"
      ? questions.slice().sort((a, b) => b.countAsked - a.countAsked)
      : order === "ascRC"
      ? questions.slice().sort((a, b) => {
          const percA = Number(a.countRight) / (Number(a.countAsked) + 0.01);
          const percB = Number(b.countRight) + (Number(b.countAsked) + 0.01);

          return percA - percB;
        })
      : order === "descRC"
      ? questions.slice().sort((a, b) => {
          const percA = Number(a.countRight) / (Number(a.countAsked) + 0.01);
          const percB = Number(b.countRight) + (Number(b.countAsked) + 0.01);

          return percB - percA;
        })
      : questions.slice()
  );

  return (
    <StyledTablePage>
      <StyledTable>
        <thead>
          <tr>
            <StyledTableHeader colSpan="10">
              <h1>Toate Întrebările</h1>
            </StyledTableHeader>
          </tr>
          <tr>
            <StyledTableHeader>Nr. Crt.</StyledTableHeader>
            <StyledTableHeader>
              Întrebare
              <div>
                <button onClick={() => setOrder("ascIntr")}>🔼</button>
                <button onClick={() => setOrder("descIntr")}>🔽</button>
              </div>
            </StyledTableHeader>
            <StyledTableHeader>
              Răspuns
              <div>
                <button onClick={() => setOrder("ascRsp")}>🔼</button>
                <button onClick={() => setOrder("descRsp")}>🔽</button>
              </div>
            </StyledTableHeader>
            <StyledTableHeader>Subiect</StyledTableHeader>
            <StyledTableHeader>
              Nivel de Cunoaștere
              <div>
                <button onClick={() => setOrder("ascNiv")}>🔼</button>
                <button onClick={() => setOrder("descNiv")}>🔽</button>
              </div>
            </StyledTableHeader>
            <StyledTableHeader>Variante Greșite</StyledTableHeader>
            <StyledTableHeader>
              Răspunsuri date
              <div>
                <button onClick={() => setOrder("ascRD")}>🔼</button>
                <button onClick={() => setOrder("descRD")}>🔽</button>
              </div>
            </StyledTableHeader>
            <StyledTableHeader>
              Răspunsuri corecte
              <div>
                <button onClick={() => setOrder("ascRC")}>🔼</button>
                <button onClick={() => setOrder("descRC")}>🔽</button>
              </div>
            </StyledTableHeader>
            <StyledTableHeader>Del.</StyledTableHeader>
            <StyledTableHeader>Reset</StyledTableHeader>
          </tr>
        </thead>
        <tbody>
          <StyledTableCell>
            <StyledButton onClick={createQuestion}>
              Adaugă Întrebare
            </StyledButton>
          </StyledTableCell>
          <StyledTableCell>
            <input
              type="text"
              placeholder="Întrebare nouă..."
              id=""
              onChange={(e) => {
                setNewQ(e.target.value);
              }}
            />
          </StyledTableCell>
          <StyledTableCell>
            <input
              type="text"
              placeholder="Răspuns..."
              id=""
              onChange={(e) => {
                setNewA(e.target.value);
              }}
            />
          </StyledTableCell>
          <StyledTableCell>
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            >
              {subjects.map((row) => (
                <option value={row.subjectName}>{row.subjectName}</option>
              ))}
            </select>
          </StyledTableCell>
          <StyledTableCell>50%</StyledTableCell>
          <StyledTableCell>
            <input
              type="text"
              placeholder="Variante..."
              id=""
              onChange={(e) => {
                setNewWrongA(e.target.value);
              }}
            />
          </StyledTableCell>
          <StyledTableCell>0</StyledTableCell>
          <StyledTableCell>0%</StyledTableCell>
          <StyledTableCell>
            <button>❌</button>
          </StyledTableCell>
          <StyledTableCell>
            <button>✒</button>
          </StyledTableCell>
          {sortedQuestions.map((row) => (
            <tr key={row.id}>
              <StyledTableCell>
                {sortedQuestions.indexOf(row) + 1}
              </StyledTableCell>
              <StyledTableCell>{row.q}</StyledTableCell>
              <StyledTableCell>{row.a}</StyledTableCell>
              <StyledTableCell>{row.subject}</StyledTableCell>
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

              <StyledTableCell>
                <button
                  onClick={() => {
                    const userConfirmed = window.confirm(
                      "Ești sigur că vrei să ștergi întrebarea?"
                    );
                    if (userConfirmed) {
                      deleteQuestion(row.id);
                    }
                  }}
                >
                  ❌
                </button>
              </StyledTableCell>

              <StyledTableCell>
                <button
                  onClick={() => {
                    const userConfirmed = window.confirm(
                      "Ești sigur că vrei să resetezi întrebarea?"
                    );
                    if (userConfirmed) {
                      questionReset(row.id);
                    }
                  }}
                >
                  ✒
                </button>
              </StyledTableCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledTablePage>
  );
};

export default DefaultSubject;
