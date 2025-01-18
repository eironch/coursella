import PropTypes from "prop-types";

HistoryTab.propTypes = {
  preparedBy: PropTypes.object.isRequired,
};

export default function HistoryTab({ preparedBy }) {
  const revisionHistoryColumns = [
    "Revision Number",
    "Date of Revision",
    "Date of Implementation",
    "Highlights of Revision",
  ];
  const thHistoryClassMap = {
    "Revision Number": "flex-[2]",
    "Date of Revision": "flex-[3]",
    "Date of Implementation": "flex-[3]",
    "Highlights of Revision": "flex-[3]",
  };
  const tdHistoryClassMap = ["flex-[2]", "flex-[3]", "flex-[3]", "flex-[3]"];

  const revisionHistoryValues = [
    [
      1,
      "January 9, 2017",
      "August 15, 2017",
      <>
        Inclusions of PEO and Relationship to University Mission
        <br />
        Student Outcomes and Relationship to PEO
        <br />
        Course Outcomes and Relationship to Student Outcomes
        <br />
        Inclusions of the Campus Goals and Objectives of the Department
      </>,
    ],
    [
      2,
      "January 16, 2017",
      "August 22, 2017",
      <>
        Program Goals stipulated form PSGs
        <br />
        Revision of PEO stipulated from PSGs
        <br />
        Format (Program/Student Outcome)
        <br />
        Program Outcome Code (Number of columns depend on the number of
        program/student outcome)
        <br />
        Additional column for course coverage (Course Outcome)
      </>,
    ],
    [3, "August 06, 2018", "August 13, 2018", "Format based from ISO"],
  ];

  return (
    <div className="flex w-full flex-col gap-5">
      <h2 className="flex w-full justify-center font-bold q-text-xl">
        Revision History
      </h2>
      <div className="flex border-2 p-5 q-rounded-2xl">
        <table className="w-full">
          <thead>
            <tr className="flex w-full items-center rounded-2xl bg-secondary q-text-sm">
              {revisionHistoryColumns.map((column, index) => (
                <th
                  className={`${thHistoryClassMap[column] || "flex-[2]"} w-full py-5`}
                  key={index}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {revisionHistoryValues.map((value, index) => (
              <tr
                className={`${revisionHistoryValues.length !== index + 1 && "border-b-2"} flex w-full items-center rounded-t-2xl py-4 text-center q-text-sm`}
                key={index}
              >
                {value.map((item, index) => (
                  <td
                    className={`${tdHistoryClassMap[index] || "flex-[2]"} flex w-full items-center justify-center`}
                    key={index}
                  >
                    {item}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex border-2 p-5 q-rounded-2xl">
        <table className="w-full">
          <tbody>
            <tr className="flex w-full rounded-t-2xl py-4 q-text-sm">
              <td className="flex w-full">
                Prepared by:
                <br />
                <br />
                {preparedBy.fullName}
                <br />
                Instructor
                <br />
                E-mail: {preparedBy.email}
                <br />
                {preparedBy.department}
                <br />
                Date Prepared: {preparedBy.datePrepared}
              </td>
              <td className="flex w-full">
                Evaluated by:
                <br />
                <br />
                DONNALYN B. MONTALLANA, MIT
                <br />
                Department Chairperson
                <br />
                Department of Computer Studies
                <br />
                Date Evaluated:
              </td>
              <td className="flex w-full">
                Approved:
                <br />
                <br />
                MENVYLUZ S. MACALALAD, MBA
                <br />
                College/Campus Dean
                <br />
                College/Campus: Bacoor City Campus
                <br />
                Date Approved:
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
