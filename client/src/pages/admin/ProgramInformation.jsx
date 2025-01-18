import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useAppContext } from "../../context/AppContext.jsx";

import Table from "../../components/Table.jsx";

ProgramInformation.propTypes = {
  searchParams: PropTypes.array.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

export default function ProgramInformation({
  searchParams,
  setSearchParams,
  data,
}) {
  return (
    <div className="flex w-full h-full p-5">
      <Table
        columnNames={[
          "Course Code",
          "Course Title",
          "Credit Unit<br>(LEC)",
          "Credit Unit<br>(LAB)",
          "Contact Hrs<br>(LEC)",
          "Contact Hrs<br>(LAB)",
          "Pre-requisite",
        ]}
        data={data}
        removeWhere={[0, -1]}
        compressedAt={-1}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        thClassMap={{
          "Course Title": "flex-[3]",
          "Course Code": "flex-[2]",
          "Pre-requisite": "flex-[2]",
        }}
        tdClassMap={{
          courseTitle: "flex-[3]",
          courseCode: "flex-[2]",
          prerequisite: "flex-[2]",
        }}
      />
    </div>
  );
}
