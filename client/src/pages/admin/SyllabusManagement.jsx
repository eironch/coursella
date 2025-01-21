import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import Table from "../../components/Table.jsx";

SyllabusManagement.propTypes = {
  syllabi: PropTypes.array.isRequired,
  searchParams: PropTypes.array.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  handleSyllabusModalOpen: PropTypes.func.isRequired,
};

export default function SyllabusManagement({
  syllabi,
  searchParams,
  setSearchParams,
  handleSyllabusModalOpen,
}) {
  const navigate = useNavigate();

  function setSyllabusId(targetId) {
    navigate(`/admin/syllabus/${targetId}`);
  }

  return (
    <div className="flex h-full w-full flex-col items-none p-5 q-text-sm">
      <Table
        columnNames={[
          "Syllabus ID",
          "Course Code",
          "Course Title",
          "Semester",
          "Academic Year",
          "Prepared Date",
          "Instructor",
        ]}
        data={syllabi}
        removeWhere={[0, 0]}
        compressedAt={-1}
        thClassMap={{
          "Course Title": "flex-[2]",
          "Course Code": "flex-[2]",
          "Prepared Date": "flex-[2]",
        }}
        tdClassMap={{
          courseTitle: "flex-[2]",
          courseCode: "flex-[2]",
          datePrepared: "flex-[2]",
        }}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        setTargetId={setSyllabusId}
        setModalOpen={handleSyllabusModalOpen}
      />
    </div>
  );
}
