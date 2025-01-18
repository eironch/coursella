export default function UniversityInfo({ }) {
  const universityInfo = {
    "Core Values": (
      <>
        Students are expected to live by and stand for the following University
        tenets:
        <br />
        <br />
        TRUTH is demonstrated by the student&apos;s objectivity and honesty
        during examinations, class activities and in the development of
        projects.
        <br />
        <br />
        EXCELLENCE is exhibited by the students&apos; self-confidence,
        punctuality, diligence and commitment in the assigned tasks, class
        performance and other course requirements.
        <br />
        <br />
        SERVICE is manifested by the students&apos; respect, rapport, fairness
        and cooperation in dealing with their peers and members of the
        community. In addition, they should exhibit love and respect for nature
        and support for the cause of humanity.
      </>
    ),
    "Goals of the College / Campus": (
      <>
        In support to the Vision and Mission of the University, CvSU &ndash;
        Bacoor City Campus shall:
        <br />
        <br />
        <div className="pl-5">
          1. Provide quality and affordable education that promotes intellectual
          growth, academic excellence, and moral integrity.
          <br />
          <br />
          2. Prepare students to meet the demands of the global market and
          respond to society&apos;s needs.
          <br />
          <br />
          3. Develop innovative and scholarly researchers who can create new
          understanding in the quest for GAD-related quality research through
          inquiry, analysis, and problem solving.
          <br />
          <br />
          4. Produce globally competitive graduates with full competence in
          their fields of study.
        </div>
      </>
    ),
    "Objectives of the Department": (
      <>
        The department shall endeavor to:
        <br />
        <br />
        <div className="pl-5">
          1. Provide in-depth knowledge across fundamental areas of Information
          Technology and Computer Science to help students become successful
          professionals in diverse career paths.
          <br />
          <br />
          2. Deliver skilled graduates in designing and developing hardware and
          software systems of varying complexity.
          <br />
          <br />
          3. Inculcate teaching principles in the field of technological
          information and application that contribute to the personal, social,
          and economic growth of students.
          <br />
          <br />
          4. Develop technological research applying mathematical foundations,
          algorithmic principles, and theories to contribute to technical
          standards and interoperability.
          <br />
          <br />
          5. Strengthen IT linkages with government and non-government
          organizations.
        </div>
      </>
    ),
  };
  return (
    <div className="w-full gap-5 border-2 border-secondary text-tertiary q-rounded-2xl">
      <div className="w-full">
        {Object.entries(universityInfo).map(([key, value], index) => (
          <div
            className={`${key !== "Objectives of the Department" && "border-b-2 border-secondary"} flex h-full w-full items-center gap-10 px-5 py-5 text-center q-text-sm`}
            key={index}
          >
            <div className="w-full flex-[2] border-r-2 py-5">{key}</div>
            <div className="w-full flex-[4] text-left">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
