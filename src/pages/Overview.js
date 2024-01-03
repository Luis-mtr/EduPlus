import React from "react";
import { Link } from "react-router-dom";

const Overview = () => {
  return (
    <div className="home">
      <h1>
        EduPlus
        <br />
      </h1>

      <p className="info">
        <br />
        Bine ati venit la EduPlus
        <br /> <br />
        Aceasta este o aplicație care vă ajută să rețineți informații prin
        testare repetată
        <br />
        <br />
        Întrebările se vor repeta în funcție de corectitudinea răspunsurilor
        date
        <br />
        <br />
        Puteți adăuga Întrebări în secțiunea{" "}
        <Link to={{ pathname: `/AllQuestions` }}>'Toate Întrebările'</Link> și
        le puteți încadra în{" "}
        <Link to={{ pathname: `/Subjects` }}>Subiectele</Link> definite
      </p>
    </div>
  );
};

export default Overview;
