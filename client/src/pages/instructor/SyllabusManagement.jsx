import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import Table from "../../components/Table.jsx";

import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext.jsx";

SyllabusManagement.propTypes = {
  programName: PropTypes.string.isRequired,
  syllabi: PropTypes.array.isRequired,
  setSyllabi: PropTypes.func.isRequired,
  searchParams: PropTypes.array.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  handleSyllabusModalOpen: PropTypes.func.isRequired,
};

export default function SyllabusManagement({
  programName,
  syllabi,
  setSyllabi,
  searchParams,
  setSearchParams,
  handleSyllabusModalOpen,
}) {
  const { api, log, error } = useAppContext();
  const navigate = useNavigate();

  function setSyllabusId(targetId) {
    navigate(`/instructor/syllabus/${targetId}`);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function getSyllabiCoordinator() {
      try {
        const res = await api.get("/admin/get-syllabi", {
          params: { programName},
          signal: controller.signal,
        });
        log(res);

        const payload = res.data.payload;

        setSyllabi(payload);
      } catch (err) {
        error(err);
      }
    }

    getSyllabiCoordinator();

    return () => {
      controller.abort();
    };
  }, [programName]);

  return (
    <div className="flex h-full w-full flex-col p-5 q-text-sm">
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
