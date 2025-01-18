import { Fragment } from "react";
import PropTypes from "prop-types";

import AddPrimary from "../../../assets/add-primary.svg";
import DeletePrimary from "../../../assets/delete-primary.svg";

import InputField from "../../../components/InputField";
import Combobox from "../../../components/Combobox";

DetailsTab.propTypes = {
  handleSyllabusChange: PropTypes.func.isRequired,
  selectedCoverages: PropTypes.object.isRequired,
  setSelectedCoverages: PropTypes.func.isRequired,
  coverages: PropTypes.array.isRequired,
  setCoverages: PropTypes.func.isRequired,
  syllabus: PropTypes.object.isRequired,
  isEditable: PropTypes.bool.isRequired,
};

export default function DetailsTab({
  handleSyllabusChange,
  selectedCoverages,
  setSelectedCoverages,
  coverages,
  setCoverages,
  syllabus,
  isEditable,
}) {
  const coverageColumnNames = [
    "Week No.",
    "Intended Learning Outcomes (ILO)",
    "Topic",
    "Teaching and Learning Activities (TLA)",
    "Mode of Delivery",
    "Resources Needed",
    "Outcomes-based Assessment (OBA)",
    "Due Date of Submission of Output",
    "Action",
  ];
  const thCoverageClassMap = {
    "Intended Learning Outcomes (ILO)": "flex-[3]",
    Topic: "flex-[3]",
    "Teaching and Learning Activities (TLA)": "flex-[2]",
    "Mode of Delivery": "flex-[2]",
    "Resources Needed": "flex-[2]",
    "Outcomes-based Assessment (OBA)": "flex-[2]",
    "Due Date of Submission of Output": "flex-[2]",
  };
  const tdCoverageClassMap = {
    ilo: "flex-[3]",
    topic: "flex-[3]",
    tla: "flex-[2]",
    modeOfDelivery: "flex-[2]",
    resourcesNeeded: "flex-[2]",
    oba: "flex-[2]",
    outputDueDate: "flex-[2]",
  };
  const coveragePlaceholders = [
    "intended learning outcomes",
    "topic",
    "activities",
    "mode of delivery",
    "resources",
    "assessment",
  ];

  const transmutationMap = {
    "96.7 - 100.0": "1.00",
    "93.4 - 96.6": "1.25",
    "90.1 - 93.30": "1.50",
    "86.7 - 90.0": "1.75",
    "83.4 - 86.6": "2.00",
    "80.1 - 83.3": "2.25",
    "76.7 - 80.0": "2.50",
    "73.4 - 76.6": "2.75",
    "70.00 - 73.3": "3.00",
    "50.0 - 69.9": "4.00",
    "Below 50": "5.00",
    INC: "Passed the course but lack some requirements.",
    Dropped: "If unexcused absence is at least 20% of the Total Class Hours.",
  };

  const lecOnlyDistribution = {
    lecture: {
      weight: 100,
      components: {
        "Midterm Exam": 20,
        "Final Exam": 20,
        Attendance: 10,
        "Outputs / Portfolio": 25,
        "Quizzes / Long Exams": 15,
        "Class Participation": 10,
      },
    },
  };
  const lecAndLabDistribution = {
    lecture: {
      weight: 60,
      components: {
        "Midterm Exam": 20,
        "Final Exam": 20,
        Attendance: 10,
        "Outputs / Portfolio": 25,
        "Quizzes / Long Exams": 15,
        "Class Participation": 10,
      },
    },
    laboratory: {
      weight: 40,
      components: {
        "Laboratory Reports": 50,
        "Exam(Practical / Written)": 30,
        "Attendance / Class Participation": 20,
      },
    },
  };
  const labAndLecDistribution = {
    lecture: {
      weight: 40,
      components: {
        "Midterm Exam": 20,
        "Final Exam": 20,
        Attendance: 10,
        "Outputs / Portfolio": 25,
        "Quizzes / Long Exams": 15,
        "Class Participation": 10,
      },
    },
    laboratory: {
      weight: 60,
      components: {
        "Laboratory Reports": 50,
        "Exam(Practical / Written)": 30,
        "Attendance / Class Participation": 20,
      },
    },
  };

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h2 className="flex w-full justify-center font-bold q-text-xl">
          Course Coverage
        </h2>
        <div className="scrollable-div w-full overflow-y-hidden overflow-x-scroll rounded-xl border-2 p-5">
          <table className="min-w-[2000px] flex-col gap-5 text-tertiary">
            <thead>
              <tr className="flex items-center rounded-2xl bg-secondary q-text-sm">
                {coverageColumnNames.map((name, index) => (
                  <Fragment key={index}>
                    {isEditable && (
                      <th
                        className={`${thCoverageClassMap[name] || "flex-1"} w-full py-5`}
                        dangerouslySetInnerHTML={{ __html: name }}
                      ></th>
                    )}
                    {!isEditable && name !== "Action" && (
                      <th
                        className={`${thCoverageClassMap[name] || "flex-1"} w-full py-5`}
                        key={index}
                        dangerouslySetInnerHTML={{ __html: name }}
                      ></th>
                    )}
                  </Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="flex w-full flex-col mt-5">
              {coverages.length < 18 && isEditable && (
                <tr className="mt-5 flex w-full items-center border-2 border-highlight-light py-5 text-center q-text-sm q-rounded-2xl">
                  <td className="w-full flex-[1]">
                    <p>{coverages.length + 1}</p>
                  </td>
                  {Object.entries(selectedCoverages).map(
                    ([key, value], index) => (
                      <td
                        className={`${tdCoverageClassMap[key] || "flex-[1]"} w-full`}
                        key={index}
                      >
                        <div className="px-2">
                          <InputField
                            labelText=""
                            placeholder={`Enter ${coveragePlaceholders[index]}`}
                            name={key}
                            value={value}
                            setValue={(e) => {
                              setSelectedCoverages((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }));
                            }}
                            type={`${key !== "outputDueDate" ? "text" : "date"}`}
                            attr="w-full"
                            disabled={!isEditable}
                          />
                        </div>
                      </td>
                    ),
                  )}
                  <td className="w-full flex-[1]">
                    <button
                      className="rounded-xl bg-highlight p-3 hover:bg-highlight-light disabled:bg-tertiary disabled:opacity-50"
                      onClick={() => {
                        setCoverages((prev) => {
                          const newCoverages = prev;

                          newCoverages.push(selectedCoverages);
                          if (coverages.length === 8 || coverages.length === 17)
                            newCoverages.push({
                              ilo: "",
                              topic: "",
                              tla: "",
                              modeOfDelivery: "",
                              resourcesNeeded: "",
                              oba: "",
                              outputDueDate: "",
                            });

                          return newCoverages;
                        });

                        setSelectedCoverages((prev) => {
                          const updatedValues = {};

                          Object.keys(prev).forEach((key) => {
                            if(key !== "outputDueDate") {
                              updatedValues[key] = "";
                            } else {
                              updatedValues[key] = prev[key];
                            }
                          });

                          return updatedValues;
                        });
                      }}
                      disabled={coverages.some((coverage) => !coverage)}
                    >
                      <img className="w-4" src={AddPrimary} />
                    </button>
                  </td>
                </tr>
              )}
              {coverages.map((coverage, index) => (
                <Fragment key={index}>
                  {index !== 8 && index !== 17 && (
                    <tr
                      className={`${coverages.length !== index + 1 && "border-b-2"} flex w-full items-center py-4 text-center q-text-sm`}
                    >
                      <td className="w-full flex-[1]">
                        <p>{index + 1}</p>
                      </td>
                      {Object.entries(coverage).map(
                        ([key, value], i) =>
                          key !== "weekNo" && (
                            <td
                              className={`${tdCoverageClassMap[key] || "flex-[1]"} w-full`}
                              key={i}
                            >
                              <div className="px-2">
                                <InputField
                                  labelText=""
                                  placeholder={`Enter ${coveragePlaceholders[i]}`}
                                  name={key}
                                  value={value}
                                  setValue={(e) => {
                                    setCoverages((prev) => {
                                      const newArray = [...prev];

                                      newArray[index][key] = e.target.value;

                                      return [...newArray];
                                    });
                                  }}
                                  type={`${key !== "outputDueDate" ? "text" : "date"}`}
                                  attr="w-full"
                                  disabled={!isEditable}
                                />
                              </div>
                            </td>
                          ),
                      )}
                      {isEditable && (
                        <td className="w-full flex-[1]">
                          <button
                            className="rounded-xl bg-red-600 p-3 hover:bg-red-500"
                            onClick={() =>
                              setCoverages((prev) => {
                                const newArray = [...prev];

                                newArray.splice(index, 1);

                                if (prev.length < 9) return newArray;

                                const cleanedArray = newArray.filter(
                                  (array) =>
                                    JSON.stringify(array) !==
                                    JSON.stringify({}),
                                );

                                if (cleanedArray.length >= 8)
                                  cleanedArray.splice(8, 0, {});

                                if (cleanedArray.length == 18)
                                  cleanedArray.splice(17, 0, {});

                                return cleanedArray;
                              })
                            }
                          >
                            <img className="w-4" src={DeletePrimary} />
                          </button>
                        </td>
                      )}
                    </tr>
                  )}
                  {(index === 8 || index === 17) && (
                    <tr
                      className="flex w-full items-center rounded-t-2xl border-b-2 py-4 text-center q-text-sm"
                      key={index}
                    >
                      <td className="w-full flex-[1]">
                        <p>{index + 1}</p>
                      </td>
                      <td className="w-full flex-[17]">
                        {index === 8
                          ? "MIDTERM EXAMINATION"
                          : "FINAL EXAMINATION"}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
        <h2 className="flex w-full justify-center font-bold q-text-xl">
          Course Requirements
        </h2>
        <div className="border-2 p-5 q-rounded-2xl">
          Lecture Requirements:
          <br />
          <br />
          <div className="pl-5">
            1. Recitation
            <br />
            <br />
            2. Quizzes / Activities
            <br />
            <br />
            3. Mid-Term Examination
            <br />
            <br />
            4. Final Examination
            <br />
            <br />
            5. Project (Individual)
          </div>
          <br />
          *All exams must follow a Table of Specifications (TOS) and Rubrics for
          evaluation of student&apos; performance or projects.
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
        <h2 className="flex w-full justify-center font-bold q-text-xl">
          Grading System
        </h2>
        <div className="flex w-full flex-col border-2 p-5 q-rounded-2xl">
          <h2 className="mb-5 flex w-full justify-center rounded-2xl bg-secondary py-5">
            STANDARD TRANSMUTATION TABLE FOR ALL COURSES
          </h2>
          <div className="w-full">
            <table className="w-full">
              <tbody>
                {Object.entries(transmutationMap).map(([key, value], index) => (
                  <tr
                    className="flex w-full items-center border-b-2 py-4 text-center q-text-sm"
                    key={index}
                  >
                    <td className="w-full">{key}</td>
                    <td className="w-full">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          <div className="mt-5">
            Total Class Hours / Semester:
            <div className="pl-5">
              (3 unit Lec &apos; 54 hrs; 2 unit Lec &apos; 36 hrs) (1 unit Lab
              &apos; 54 hrs; 2 units Lab &apos; 108 hrs; 3 units Lab &apos; 162
              hrs)
            </div>
          </div>
        </div>
      </div>
      <Combobox
        items={[
          "Lecture Only (3 units)",
          "Lecture (2 units) and Laboratory (1 unit)",
          "Lecture (1 unit) and Laboratory (2 units)",
        ]}
        isSearchable={true}
        labelText="Grading System"
        placeholder="Select grading system"
        name="gradingSystem"
        value={syllabus.gradingSystem}
        setValue={handleSyllabusChange}
        type="text"
        attr="w-full"
        disabled={!isEditable}
      />
      <div className="border-2 p-5 pt-0 q-rounded-2xl">
        <table className="min-h-[200px] w-full flex-col gap-5 text-tertiary">
          <tbody className="w-full flex-col">
            {syllabus.gradingSystem === "Lecture Only (3 units)" && (
              <>
                <tr className="my-5 flex justify-center rounded-2xl bg-secondary py-4 q-text-lg">
                  <td>Lecture</td>
                </tr>
                {Object.entries(lecOnlyDistribution.lecture.components).map(
                  ([key, value], index) => (
                    <tr
                      className="flex w-full items-center border-b-2 py-4 text-center q-text-sm"
                      key={index}
                    >
                      <td className="w-full">{key}</td>
                      <td className="w-full">{value}%</td>
                    </tr>
                  ),
                )}
                <tr className="flex w-full items-center border-t-2 py-4 text-center q-text-sm">
                  <td className="w-full">Total</td>
                  <td className="w-full">
                    {lecOnlyDistribution.lecture.weight}%
                  </td>
                </tr>
              </>
            )}
            {syllabus.gradingSystem ===
              "Lecture (2 units) and Laboratory (1 unit)" && (
              <>
                <tr className="my-5 flex justify-center rounded-2xl bg-secondary py-4 q-text-lg">
                  <td>Lecture</td>
                </tr>
                {Object.entries(lecAndLabDistribution.lecture.components).map(
                  ([key, value], index) => (
                    <tr
                      className="flex w-full items-center border-b-2 py-4 text-center q-text-sm"
                      key={index}
                    >
                      <td className="w-full">{key}</td>
                      <td className="w-full">{value}%</td>
                    </tr>
                  ),
                )}
                <tr className="flex w-full items-center border-t-2 py-4 text-center q-text-sm">
                  <td className="w-full">Total</td>
                  <td className="w-full">
                    {lecAndLabDistribution.lecture.weight}%
                  </td>
                </tr>
                <tr className="my-5 flex justify-center rounded-2xl bg-secondary py-4 q-text-lg">
                  <td>Laboratory</td>
                </tr>
                {Object.entries(
                  lecAndLabDistribution.laboratory.components,
                ).map(([key, value], index) => (
                  <tr
                    className="flex w-full items-center border-b-2 py-4 text-center q-text-sm"
                    key={index}
                  >
                    <td className="w-full">{key}</td>
                    <td className="w-full">{value}%</td>
                  </tr>
                ))}
                <tr className="flex w-full items-center border-t-2 py-4 text-center q-text-sm">
                  <td className="w-full">Total</td>
                  <td className="w-full">
                    {lecAndLabDistribution.laboratory.weight}%
                  </td>
                </tr>
              </>
            )}
            {syllabus.gradingSystem ===
              "Lecture (1 unit) and Laboratory (2 units)" && (
              <>
                <tr className="my-5 flex justify-center rounded-2xl bg-secondary py-4 q-text-lg">
                  <td>Lecture</td>
                </tr>
                {Object.entries(labAndLecDistribution.lecture.components).map(
                  ([key, value], index) => (
                    <tr
                      className="flex w-full items-center border-b-2 py-4 text-center q-text-sm"
                      key={index}
                    >
                      <td className="w-full">{key}</td>
                      <td className="w-full">{value}%</td>
                    </tr>
                  ),
                )}
                <tr className="flex w-full items-center border-t-2 py-4 text-center q-text-sm">
                  <td className="w-full">Total</td>
                  <td className="w-full">
                    {labAndLecDistribution.lecture.weight}%
                  </td>
                </tr>
                <tr className="my-5 flex justify-center rounded-2xl bg-secondary py-4 q-text-lg">
                  <td>Laboratory</td>
                </tr>
                {Object.entries(
                  labAndLecDistribution.laboratory.components,
                ).map(([key, value], index) => (
                  <tr
                    className="flex w-full items-center border-b-2 py-4 text-center q-text-sm"
                    key={index}
                  >
                    <td className="w-full">{key}</td>
                    <td className="w-full">{value}%</td>
                  </tr>
                ))}
                <tr className="flex w-full items-center border-t-2 py-4 text-center q-text-sm">
                  <td className="w-full">Total</td>
                  <td className="w-full">
                    {labAndLecDistribution.laboratory.weight}%
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
