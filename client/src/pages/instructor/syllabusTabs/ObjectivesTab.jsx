import { useEffect, Fragment } from "react";
import PropTypes from "prop-types";

import AddPrimary from "../../../assets/add-primary.svg";
import DeletePrimary from "../../../assets/delete-primary.svg";

import InputField from "../../../components/InputField.jsx";

ObjectivesTab.propTypes = {
  selectedOutcome: PropTypes.object.isRequired,
  setSelectedOutcome: PropTypes.func.isRequired,
  outcomes: PropTypes.array.isRequired,
  setOutcomes: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
};

export default function ObjectivesTab({
  selectedOutcome,
  setSelectedOutcome,
  outcomes,
  setOutcomes,
  isEditable,
}) {
  const objectiveColumnNames = [
    "",
    "Program / Student Outcomes (based on the program CMO)",
    "Program Educational Objectives Code (based on the program CMO)",
  ];
  const thObjectiveClassMap = {
    "": "flex-[2]",
    "Program / Student Outcomes (based on the program CMO)": "flex-[13]",
    "Program Educational Objectives Code (based on the program CMO)":
      "flex-[12] px-2",
  };
  const outcomeColumnNames = [
    "",
    "Program Outcomes Addressed by the Course",
    "Program / Student Outcomes Code",
    "Action",
  ];
  const thOutcomeClassMap = {
    "Program Outcomes Addressed by the Course": "flex-[7]",
    "Program / Student Outcomes Code": "flex-[5]",
    Action: "flex-[2]",
  };
  const objectives = [
    {
      a: "Apply knowledge of computing fundamentals, computing specialization, mathematics, science, and domain knowledge appropriate for the computing specialization to the development of computing models from defined problems and requirements.",
      codes: [true, true, true, false, false],
    },
    {
      b: "Communicate effectively both in oral and written form and act in recognition of professional, social, and ethical responsibility.",
      codes: [false, false, false, true, true],
    },
    {
      c: "Identify, analyze, formulate, conduct research, and solve computing problems and requirements reaching validated conclusions using fundamental principles of mathematics, computing sciences, and relevant domain disciplines.",
      codes: [false, true, true, false, true],
    },
    {
      d: "Design and develop computing solutions using a system-level perspective.",
      codes: [false, true, true, false, false],
    },
    {
      e: "Create and use existing and modern computing tools and appropriate techniques to complex activities.",
      codes: [false, false, true, true, false],
    },
    {
      f: "Recognize the need, and have the ability to engage in independent learning for continual development as a computing professional.",
      codes: [false, false, false, true, true],
    },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex flex-col gap-5 overflow-hidden">
        <h2 className="flex w-full justify-center font-bold q-text-xl">
          Program Educational Objectives (based on the program CMO)
        </h2>
        <div className="border-2 border-secondary p-5 q-rounded-xl">
          To attain the objectives of the department, the program aims to
          produce graduates who can:
          <br />
          <br />
          <div className="pl-5">
            1. Acquire skills and disciplines required for designing, writing,
            and modifying software components, modules and applications that
            comprise software solutions;
            <br />
            <br />
            2. Analyze complex problems and ethically demonstrate critical and
            logical problem solving skills to develop computer-based solutions
            in a collaborative environment;
            <br />
            <br />
            3. Design algorithmic software and develop new and effective
            algorithms for solving computing problems;
            <br />
            <br />
            4. Utilize modern computing tools in legal, social, ethical and
            professional manner and engage in life-long learning endeavors; and
            <br />
            <br />
            5. Conduct relevant technological researches in the field of
            Computer Science with effective communication, reports, and design
            documentation.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
        <h2 className="flex w-full justify-center font-bold q-text-xl">
          Student Outcomes and Relationship to Program Educational Objectives
        </h2>
        <div className="flex border-2 p-5 q-rounded-2xl">
          <table className="flex w-full flex-col gap-5 text-tertiary">
            <thead className="flex w-full">
              <tr className="flex w-full items-center rounded-2xl bg-secondary q-text-sm">
                {objectiveColumnNames.map((name, index) => (
                  <th
                    className={`${thObjectiveClassMap[name] || "flex-1"} w-full py-5`}
                    key={index}
                  >
                    <div className="flex flex-col gap-5">
                      <h1>{name}</h1>
                      {name ===
                        "Program Educational Objectives Code (based on the program CMO)" && (
                        <div className="flex">
                          {Array(5)
                            .fill()
                            .map((_, index) => (
                              <p className="w-full" key={index}>
                                {index + 1}
                              </p>
                            ))}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="flex w-full flex-col">
              {objectives.map((objective, index) => (
                <tr
                  className={`${objectives.length !== index + 1 && "border-b-2"} flex w-full items-center rounded-t-2xl py-5 text-center q-text-sm`}
                  key={index}
                >
                  <td className="w-full flex-[2]">
                    {Object.keys(objective)[0]}.
                  </td>
                  <td className="w-full flex-[13] text-left">
                    {objective[Object.keys(objective)[0]]}
                  </td>
                  <td className="flex w-full flex-[12] px-2">
                    {objective.codes.map((code, index) => (
                      <div className="w-full" key={index}>
                        <input
                          type="checkbox"
                          checked={code || false}
                          disabled={true}
                        />
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex w-full flex-col gap-5">
        <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
        <h2 className="flex w-full justify-center font-bold q-text-xl">
          Course Outcomes and Relationship to Student Outcomes
        </h2>
        <div className="w-full border-2 p-5 q-rounded-2xl">
          <table className="flex w-full flex-col gap-5 text-tertiary">
            <thead className="flex w-full">
              <tr className="flex w-full items-center rounded-2xl bg-secondary q-text-sm">
                {outcomeColumnNames.map((name, index) => (
                  <Fragment
                    key={index}
                  >
                    {isEditable && (
                      <th
                        className={`${thOutcomeClassMap[name] || "flex-1"} w-full py-5`}
                      >
                        <div className="flex flex-col gap-5">
                          <h1>{name}</h1>
                          {name ===
                            "Program Outcomes Addressed by the Course" && (
                            <div className="flex">
                              After completing this course, the students must be
                              able to:
                            </div>
                          )}
                          {name === "Program / Student Outcomes Code" && (
                            <div className="flex">
                              {["a", "b", "c", "d", "e", "f"].map(
                                (code, index) => (
                                  <p className="w-full" key={index}>
                                    {code}
                                  </p>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      </th>
                    )}
                    {!isEditable && name !== "Action" && (
                      <th
                        className={`${thOutcomeClassMap[name] || "flex-1"} w-full py-5`}
                        key={index}
                      >
                        <div className="flex flex-col gap-5">
                          <h1>{name}</h1>
                          {name ===
                            "Program Outcomes Addressed by the Course" && (
                            <div className="flex">
                              After completing this course, the students must be
                              able to:
                            </div>
                          )}
                          {name === "Program / Student Outcomes Code" && (
                            <div className="flex">
                              {["a", "b", "c", "d", "e", "f"].map(
                                (code, index) => (
                                  <p className="w-full" key={index}>
                                    {code}
                                  </p>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      </th>
                    )}
                  </Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="flex w-full flex-col">
              {isEditable && (
                <tr className="mb-5 flex w-full items-center border-2 border-highlight-light py-5 text-center q-text-sm q-rounded-2xl">
                  <td className="w-full flex-[1]">
                    {outcomes.length + 1 + "."}
                  </td>
                  <td className="w-full flex-[7]">
                    <div className="px-2">
                      <InputField
                        labelText=""
                        placeholder="Enter program outcome"
                        name="programOutcome"
                        value={selectedOutcome.value}
                        setValue={(e) =>
                          setSelectedOutcome((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }))
                        }
                        type="text"
                        attr="w-full"
                        disabled={!isEditable}
                      />
                    </div>
                  </td>
                  <td className="flex w-full flex-[5] justify-center">
                    <table className="w-full">
                      <tbody className="w-full">
                        <tr className="w-full">
                          <td className="flex w-full">
                            {selectedOutcome.codes.map((code, index) => (
                              <div className="w-full" key={index}>
                                <input
                                  type="checkbox"
                                  onChange={(e) => {
                                    setSelectedOutcome((prev) => {
                                      const newArray = [...prev.codes];
                                      newArray[index] = e.target.checked;
                                      return { ...prev, codes: newArray };
                                    });
                                  }}
                                  checked={code}
                                />
                              </div>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td className="w-full flex-[2]">
                    <button
                      className="rounded-xl bg-highlight p-3 hover:bg-highlight-light disabled:bg-tertiary disabled:opacity-50"
                      onClick={() => {
                        setOutcomes((prev) => [...prev, selectedOutcome]);
                        setSelectedOutcome({
                          values: "",
                          codes: [false, false, false, false, false, false],
                        });
                      }}
                      disabled={!selectedOutcome}
                    >
                      <img className="w-4" src={AddPrimary} />
                    </button>
                  </td>
                </tr>
              )}
              {outcomes.map((outcome, index) => (
                <tr
                  className={`${outcomes.length !== index + 1 && "border-b-2"} flex w-full items-center py-5 text-center q-text-sm`}
                  key={index}
                >
                  <td className="w-full flex-[1]">{index + 1 + ". "}</td>
                  <td className="w-full flex-[7] text-left">
                    <div className="px-2">
                      <InputField
                        labelText=""
                        placeholder="Enter program outcome"
                        name="programOutcome"
                        value={outcome.value}
                        setValue={(e) =>
                          setOutcomes((prev) => {
                            const newArray = [...prev];

                            newArray[index].value = e.target.value;

                            return [...newArray];
                          })
                        }
                        type="text"
                        attr="w-full"
                        disabled={!isEditable}
                      />
                    </div>
                  </td>
                  <td className="flex w-full flex-[5]">
                    {outcome.codes.map((code, i) => (
                      <div className="w-full" key={i}>
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            setOutcomes((prev) => {
                              const newArray = [...prev];

                              newArray[index].codes[i] = e.target.checked;

                              return [...newArray];
                            });
                          }}
                          disabled={!isEditable}
                          checked={code}
                        />
                      </div>
                    ))}
                  </td>
                  {isEditable && (
                    <td className="w-full flex-[2]">
                      <button
                        className="rounded-xl bg-red-600 p-3 hover:bg-red-500"
                        onClick={() =>
                          setOutcomes((prev) => {
                            const newArray = [...prev];
                            newArray.splice(index, 1);
                            return newArray;
                          })
                        }
                      >
                        <img className="w-4" src={DeletePrimary} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
