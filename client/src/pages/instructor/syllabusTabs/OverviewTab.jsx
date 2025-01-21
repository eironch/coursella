import PropTypes from "prop-types";

import InputField from "../../../components/InputField.jsx";
import Combobox from "../../../components/Combobox.jsx";

OverviewTab.propTypes = {
  handleSyllabusChange: PropTypes.func.isRequired,
  syllabus: PropTypes.object.isRequired,
  courseCodes: PropTypes.array.isRequired,
  schedules: PropTypes.array.isRequired,
  setSchedules: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
};

export default function OverviewTab({
  handleSyllabusChange,
  syllabus,
  courseCodes,
  schedules,
  setSchedules,
  isEditable,
}) {
  function handleScheduleChange(e, index) {
    const { name, value } = e.target;

    setSchedules(
      schedules.map((schedule, i) =>
        i === index ? { ...schedule, [name]: value } : schedule,
      ),
    );
  }

  return (
    <>
      <div className="flex w-full flex-col gap-5">
        <div className="flex w-full flex-col items-center justify-center">
          <h2 className="flex font-bold q-text-xl">Course Syllabus</h2>
          <p>
            Sem {syllabus.semester || 0}, AY {syllabus.enrollmentYear || 0}-
            {syllabus.enrollmentYear + 1 || 0}
          </p>
        </div>
        <div>
          <Combobox
            items={[
              "Bachelor of Science in Computer Science",
              "Bachelor of Science in Information Technology",
            ]}
            isSearchable={true}
            labelText="Program"
            placeholder="Select program"
            name="programName"
            value={syllabus.programName}
            setValue={handleSyllabusChange}
            type="text"
            attr="w-full flex-[2]"
            disabled={!isEditable}
          />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 md:flex-row">
            <Combobox
              items={courseCodes}
              isSearchable={true}
              labelText="Course Code"
              placeholder="e.g. COSC 101"
              name="courseCode"
              value={syllabus.courseCode}
              setValue={handleSyllabusChange}
              type="text"
              attr="w-full flex-[3]"
              disabled={!isEditable}
            />
            <InputField
              labelText="Course Title"
              placeholder="Enter course title"
              name="courseTitle"
              value={syllabus.courseTitle}
              setValue={handleSyllabusChange}
              type="text"
              attr="w-full flex-[5]"
              disabled={!isEditable}
            />
            <div className="flex justify-center gap-5 py-5 md:flex-col md:py-0">
              <label
                htmlFor="lecture-checkbox"
                className="inline-flex select-none items-center"
              >
                <input
                  className="mr-2"
                  type="checkbox"
                  name="isLecture"
                  id="lecture-checkbox"
                  checked={
                    syllabus.isLecture === "true" || syllabus.isLecture === true
                  }
                  onChange={(e) => {
                    e.target.value = e.target.checked;
                    handleSyllabusChange(e);
                  }}
                  disabled={!isEditable}
                />
                Lecture
              </label>
              <label
                htmlFor="laboratory-checkbox"
                className="inline-flex select-none items-center"
              >
                <input
                  className="mr-2"
                  type="checkbox"
                  name="isLaboratory"
                  id="laboratory-checkbox"
                  checked={
                    syllabus.isLaboratory === "true" ||
                    syllabus.isLaboratory === true
                  }
                  onChange={(e) => {
                    e.target.value = e.target.checked;
                    handleSyllabusChange(e);
                  }}
                  disabled={!isEditable}
                />
                Laboratory
              </label>
            </div>
            <InputField
              labelText="Credit Units"
              placeholder="e.g. 3"
              name="creditUnits"
              value={syllabus.creditUnits}
              setValue={handleSyllabusChange}
              type="number"
              attr="w-full flex-[2]"
              disabled={!isEditable}
            />
          </div>
          {/* textfield */}
          <InputField
            labelText="Course Description"
            placeholder="Enter course description"
            name="courseDescription"
            value={syllabus.courseDescription}
            setValue={handleSyllabusChange}
            type="text"
            attr="w-full w-full"
            disabled={!isEditable}
          />
          <InputField
            labelText="Pre-requisite"
            placeholder="Enter course pre-requisite"
            name="prerequisite"
            value={syllabus.prerequisite}
            setValue={handleSyllabusChange}
            type="text"
            attr="w-full"
            disabled={!isEditable}
          />
        </div>
        <div className="flex w-full flex-col gap-5">
          <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
          <h2 className="w-full text-center font-bold q-text-xl">
            Course Schedule
          </h2>
          {schedules.map((schedule, index) => (
            <div
              className="flex flex-col gap-5 border-2 border-secondary p-5 q-rounded-xl"
              key={index}
            >
              <div className="flex gap-5">
                <Combobox
                  items={[
                    "Bachelor of Science in Information Technology",
                    "Bachelor of Science in Computer Science",
                  ]}
                  isSearchable={true}
                  labelText="Program"
                  placeholder="Select program"
                  name="programName"
                  value={schedule.programName}
                  setValue={(e) => handleScheduleChange(e, index)}
                  type="text"
                  attr="w-full flex-[5]"
                  disabled={!isEditable}
                />
                <InputField
                  labelText="Section"
                  placeholder="Enter section"
                  name="assignedSection"
                  value={schedule.assignedSection}
                  setValue={(e) => handleScheduleChange(e, index)}
                  type="text"
                  attr="w-full flex-[1]"
                  disabled={!isEditable}
                />
              </div>
              <InputField
                labelText="Lecture"
                placeholder="Enter lecture schedule"
                name="lectureSchedule"
                value={schedule.lectureSchedule}
                setValue={(e) => handleScheduleChange(e, index)}
                type="text"
                attr="w-full"
                disabled={!isEditable}
              />
              <InputField
                labelText="Laboratory"
                placeholder="Enter laboratory schedule"
                name="laboratorySchedule"
                value={schedule.laboratorySchedule}
                setValue={(e) => handleScheduleChange(e, index)}
                type="text"
                attr="w-full"
                disabled={!isEditable}
              />
              {isEditable && (
                <button
                  className="bg-red-600 px-5 py-2.5 text-primary q-rounded-xl hover:bg-red-500"
                  onClick={() =>
                    setSchedules((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Remove Course Schedule
                </button>
              )}
            </div>
          ))}
          {isEditable && (
            <button
              className="bg-highlight px-5 py-2.5 text-primary q-rounded-xl hover:bg-highlight-light"
              onClick={() =>
                setSchedules((prev) => [
                  ...prev,
                  {
                    programName: "",
                    assignedSection: "",
                    lectureSchedule: "",
                    laboratorySchedule: "",
                  },
                ])
              }
            >
              Add New Course Schedule
            </button>
          )}
        </div>
      </div>
    </>
  );
}
