import { Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPage.jsx";

import AdminPage from "./pages/AdminPage.jsx";
import InstructorPage from "./pages/InstructorPage.jsx";
import SyllabusPage from "./pages/SyllabusPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/:syllabusId" element={<AdminPage />} />
      <Route path="/instructor" element={<InstructorPage />} />
      <Route path="/instructor/:syllabusId" element={<InstructorPage />} />
      <Route path="/coordinator" element={<InstructorPage />} />
      <Route path="/coordinator/:syllabusId" element={<InstructorPage />} />
      <Route path="/syllabus/:syllabusId" element={<SyllabusPage />} />
    </Routes>
  );
}
