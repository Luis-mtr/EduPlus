// const fs = require("fs");

// // Calea către fișierul original
// const originalFilePath = "../pages/DefaultSubject.js";

// export default function CreateSubjectFile({ subject }) {
//   // Citește conținutul fișierului original
//   fs.readFile(originalFilePath, "utf8", (err, data) => {
//     if (err) {
//       console.error("Eroare la citirea fișierului original:", err);
//       return;
//     }

//     // Modifică parametrul sau ce dorești în conținutul fișierului
//     const modifiedData = data.replace(/defaultSubject/g, { subject });

//     // Calea către fișierul nou
//     const newFilePath = `../pages/SubjectPages/${subject}.js`;

//     // Scrie conținutul modificat în fișierul nou
//     fs.writeFile(newFilePath, modifiedData, "utf8", (err) => {
//       if (err) {
//         console.error("Eroare la scrierea fișierului nou:", err);
//         return;
//       }

//       console.log("Fișierul nou a fost creat cu succes!");
//     });
//   });
// }
