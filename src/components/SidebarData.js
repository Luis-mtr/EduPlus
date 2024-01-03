import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";

export default function GetSidebarData() {
  const [subjects, setSubjects] = useState([]);
  const subjectsCollectionRef = collection(db, "subjects");

  useEffect(() => {
    const getSubjects = async () => {
      const data = await getDocs(subjectsCollectionRef);
      setSubjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getSubjects();
  }, []);
  console.log(subjects);

  const SidebarData = [
    {
      title: "Testare",
      path: "/overview",
      icon: <AiIcons.AiFillHome />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          subjectName: "Studiază prin testare",
          path: "/StartLearning",
          icon: <IoIcons.IoIosPaper />,
        },
        {
          subjectName: "Statistici",
          path: "/overview/Revenue",
          icon: <IoIcons.IoIosPaper />,
        },
      ],
    },
    {
      title: "Subiecte",
      path: "/subjects",
      icon: <AiIcons.AiFillHome />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: subjects,
    },
    {
      title: "Toate Întrebările",
      path: "/AllQuestions",
      icon: <AiIcons.AiFillHome />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
    },
  ];

  return SidebarData;
}
