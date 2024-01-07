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
  where,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { useParams, useNavigate } from "react-router-dom";

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

const FlexibleTextarea = styled.textarea`
  flex: 1; // This makes the textarea flexibly grow to fill available space
  min-height: 1px; // Set a minimum height to prevent it from collapsing to zero
  resize: none; // Prevent users from manually resizing the textarea
  border: 1px solid black;
  padding: 8px;
`;

const AllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const questionsCollectionRef = collection(db, "questions");
  const [order, setOrder] = useState("ascIntr");
  const { ParamSubject } = useParams();

  console.log(ParamSubject);

  const navigate = useNavigate();

  useEffect(() => {
    const getQuestions = async () => {
      if (ParamSubject) {
        const q = query(
          questionsCollectionRef,
          where("subject", "==", ParamSubject)
        );
        const data = await getDocs(q);
        const questions = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setQuestions(questions);
      } else {
        const data = await getDocs(questionsCollectionRef);
        setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    };

    getQuestions();
  }, [ParamSubject]);

  // if (questions && ParamSubject) {
  //   const pageQuestions = questions.filter(
  //     (obj) => obj.subject === ParamSubject
  //   );
  //   setQuestions(pageQuestions);
  // }

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
  // SGODt26cjttcr2BxrDvw ECXjm6C5d4gouiF7gZm6 YbJJS3EjaW4pfLkuvLxO
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
            <StyledTableHeader colSpan="11">
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
            <StyledTableHeader>Edit</StyledTableHeader>
          </tr>
        </thead>
        <tbody>
          <StyledTableCell>
            <StyledButton onClick={createQuestion}>
              Adaugă Întrebare
            </StyledButton>
          </StyledTableCell>
          <StyledTableCell>
            <FlexibleTextarea
              type="text"
              placeholder="Întrebare nouă..."
              id=""
              onChange={(e) => {
                setNewQ(e.target.value);
              }}
            />
          </StyledTableCell>
          <StyledTableCell>
            <FlexibleTextarea
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
                <option value={row.subjectName} key={row.id}>
                  {row.subjectName}
                </option>
              ))}
            </select>
          </StyledTableCell>
          <StyledTableCell>50%</StyledTableCell>
          <StyledTableCell>
            <FlexibleTextarea
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
            <button>Reset ✒</button>
          </StyledTableCell>
          <StyledTableCell>
            <button>Edit ✒</button>
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
                {Math.floor((row.showAAskQ + row.showQAskA) / 2) + "%"}
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
                      "Ești sigur că vrei să RESETEZI întrebarea?"
                    );
                    if (userConfirmed) {
                      questionReset(row.id);
                    }
                  }}
                >
                  Reset ✒
                </button>
              </StyledTableCell>
              <StyledTableCell>
                <button
                  onClick={() => {
                    const userConfirmed = window.confirm(
                      "Ești sigur că vrei să EDITEZI întrebarea?"
                    );
                    if (userConfirmed) {
                      navigate(`/EditQuestion/${row.id}`);
                    }
                  }}
                >
                  Edit ✒
                </button>
              </StyledTableCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledTablePage>
  );
};

export default AllQuestions;
