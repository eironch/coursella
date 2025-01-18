export default function PoliciesTab() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h2 className="flex w-full justify-center font-bold q-text-xl">
          Class Policies
        </h2>
        <div className="rounded-2xl border-2 p-5">
          <div>
            A. Attendance
            <br />
            <br />
            <div className="pl-5">
              Students are not allowed to have 20% or more unexcused absences of
              the total face-to-face class hours; otherwise, they will be graded
              as “DROPPED”.
            </div>
          </div>
          <div>
            <br />
            <br />
            B. Classroom Decorum Students are required to:
            <br />
            <br />
            <div className="pl-5">
              1. Wear identification cards at all times.
              <br />
              <br />
              2. Wear face mask at all times.
              <br />
              <br />
              3. Observe physical/social distancing at all times.
              <br />
              <br />
              4. Clean the classroom before and after classes.
              <br />
              <br />
              5. Avoid unnecessary noise that might disturb other classes.
              <br />
              <br />
              6. Practice good manners and right conduct at all times.
              <br />
              <br />
              7. Practice gender sensitivity and awareness inside the classroom.
              <br />
              <br />
              8. Come to class on time.
            </div>
          </div>
          <div>
            <br />
            <br />
            C. Examination / Evaluation
            <br />
            <br />
            <div className="pl-5">
              1. Quizzes may be announced or unannounced.
              <br />
              <br />
              2. Mid-term and Final Examinations are scheduled.
              <br />
              <br />
              3. Cheating is strictly prohibited. A student who is caught
              cheating will be given a score of ”0” for the first offense. For
              the second offense, the student will be automatically given a
              failing grade in the subject.
              <br />
              <br />
              4. Students who will miss a mid-term or final examination, a
              laboratory exercise or a class project may be excused and allowed
              to take a special exam, conduct a laboratory exercise or pass a
              class project for any of the following reasons:
              <br />
              <br />
              <div className="pl-5">
                a. Participation in a University/College-approved field trip or
                activity.
                <br />
                <br />
                b. Due to illness or death in the family.
                <br />
                <br />
                c. Due to force majeure or natural calamities.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
