import PropTypes from "prop-types";

import Combobox from "../components/Combobox.jsx";
import InputField from "../components/InputField.jsx";

import { countries, nationalities } from "../constants/constants.jsx";

Information.propTypes = {
  data: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  criteria: PropTypes.array.isRequired,
  value: PropTypes.node.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default function Information({
  data,
  handleChange,
  criteria,
  value,
  disabled,
}) {
  return (
    <>
      {(value === "Student" || value === 0) && (
        <div className="flex w-full flex-col items-center justify-center gap-20">
          <div className="flex w-full flex-col items-center justify-center gap-5">
            <div className="mb-5 h-40 w-40 rounded-full bg-secondary"></div>
            <h1 className="q-text-xl">{data.fullName || "\u00A0"}</h1>
          </div>
          {data.academicStatus && (
            <div className="flex w-full flex-col gap-5">
              <InputField
                labelText="Academic Status"
                placeholder=""
                name="academicStatus"
                value={data.academicStatus || ""}
                setValue={handleChange}
                type="text"
                attr="w-full"
                disabled={disabled}
              />
              <InputField
                labelText="Program"
                placeholder=""
                name="program"
                value={data.preferredProgram || ""}
                setValue={handleChange}
                type="text"
                attr="w-full"
                disabled={disabled}
              />
            </div>
          )}
          {value === criteria[0] && !data.academicStatus && (
            <div className="flex h-full w-full flex-col items-center justify-center">
              {!disabled && (
                <h1 className="flex h-10 items-center text-tertiary q-text-xl">
                  Application Information
                  <p className="text-red-700">*</p>
                </h1>
              )}
              <div className="flex w-full flex-col gap-5">
                <Combobox
                  items={[
                    "Alternative Learning System (ALS) Passer",
                    "Foreign Undergraduate Student Applicant",
                    "Senior High School Graduate",
                    "Currently enrolled Grade 12 Student",
                    "Transferee",
                  ]}
                  isSearchable={true}
                  labelText="Applicant Type"
                  placeholder="Enter your applicant type"
                  name="applicantType"
                  value={data.applicantType || ""}
                  setValue={handleChange}
                  type="text"
                  attr="w-full"
                  disabled={disabled}
                />
                <Combobox
                  items={[
                    "Bachelor of Science in Information Technology",
                    "Bachelor of Science in Computer Science",
                  ]}
                  isSearchable={true}
                  labelText="Preferred Program"
                  placeholder="Enter your preferred program"
                  name="preferredProgram"
                  value={data.preferredProgram || ""}
                  setValue={handleChange}
                  type="text"
                  attr="w-full"
                  disabled={disabled}
                />
              </div>
            </div>
          )}
        </div>
      )}
      {value === "Profile" && (
        <div className="flex w-full flex-col items-center justify-center gap-20">
          <div className="w-30 flex flex-col items-center justify-center gap-5">
            <div className="aspect-w-1 aspect-h-1 relative h-40 w-40 rounded-full bg-secondary p-2">
              {data.profileImage && (
                <div className="rounded-full">
                  <img
                    className="absolute inset-0 h-full w-full rounded-full object-cover"
                    src={URL.createObjectURL(data.profileImage)}
                    alt=""
                  />
                </div>
              )}
              {!disabled && (
                <label
                  className={`${
                    data.profileImage && !disabled && "opacity-20"
                  } flex h-full w-full cursor-pointer items-center justify-center rounded-full border-4 border-dashed border-tertiary q-text-sm`}
                  htmlFor="profileImage"
                >
                  Upload Image
                </label>
              )}
              <input
                className="hidden"
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                disabled={disabled}
                onChange={handleChange}
              />
            </div>
            <h1 className="q-text-xl">{data.fullName || "\u00A0"}</h1>
          </div>
        </div>
      )}
      {(value === criteria[1] || value === "Personal") && (
        <div className="flex w-full flex-col items-center q-gap-5">
          <h2 className="flex font-bold q-text-xl">
            Personal Information
            {!disabled && <p className="text-red-700">*</p>}
          </h2>
          <div className="flex w-full q-gap-5">
            <InputField
              labelText="Given Name"
              placeholder="Enter your given name"
              name="givenName"
              value={data.givenName || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
            <InputField
              labelText="Middle Name"
              placeholder="Enter your middle name"
              name="middleName"
              value={data.middleName || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
          </div>
          <div className="flex w-full q-gap-5">
            <InputField
              labelText="Family Name"
              placeholder="Enter your family name"
              name="familyName"
              value={data.familyName || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
            <InputField
              labelText="Suffix"
              placeholder="Enter your suffix (optional)"
              name="suffix"
              value={data.suffix || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
          </div>
          <div className="flex w-full q-gap-5">
            <Combobox
              items={["Female", "Male"]}
              isSearchable={false}
              labelText="Sex at Birth"
              placeholder="Enter sex at birth"
              name="sexAtBirth"
              value={data.sexAtBirth || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
            <InputField
              labelText="Date of Birth"
              placeholder="MM/DD/YYYY"
              name="dateOfBirth"
              value={data.dateOfBirth || ""}
              setValue={handleChange}
              type="date"
              attr="w-full"
              disabled={disabled}
            />
          </div>
          <div className="flex w-full q-gap-5">
            <Combobox
              items={["Single", "Married", "Divorced", "Widowed", "Separated"]}
              isSearchable={true}
              labelText="Civil Status"
              placeholder="Select your civil status"
              name="civilStatus"
              value={data.civilStatus || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
            <InputField
              labelText="Contact Number"
              placeholder="Enter your contact number"
              name="contactNum"
              value={data.contactNum || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
          </div>
          <div className="flex w-full q-gap-5">
            <InputField
              labelText="Religion"
              placeholder="Enter your religion"
              name="religion"
              value={data.religion || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
            <Combobox
              items={nationalities}
              isSearchable={true}
              labelText="Nationality"
              placeholder="Enter your nationality"
              name="nationality"
              value={data.nationality || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
          </div>
          <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
          <h2 className="flex font-bold q-text-xl">
            Residential Address
            {!disabled && <p className="text-red-700">*</p>}
          </h2>
          <div className="flex w-full q-gap-5">
            <InputField
              labelText="Address Line 1"
              placeholder="Enter house no. and street address"
              name="addressLine1"
              value={data.addressLine1 || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
            <InputField
              labelText="Address Line 2"
              placeholder="Enter apartment/suite (optional)"
              name="addressLine2"
              value={data.addressLine2 || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
          </div>
          <div className="flex w-full q-gap-5">
            <InputField
              labelText="City"
              placeholder="Enter your city"
              name="city"
              value={data.city || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
            <InputField
              labelText="State/Province/Region"
              placeholder="Enter your state/province/region"
              name="stateProvinceRegion"
              value={data.stateProvinceRegion || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
          </div>
          <div className="flex w-full q-gap-5">
            <InputField
              labelText="Postal Code"
              placeholder="Enter your postal code"
              name="postalCode"
              value={data.postalCode || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
            <Combobox
              items={countries}
              isSearchable={true}
              labelText="Country"
              placeholder="Enter your country"
              name="country"
              value={data.country || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
          </div>
          <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
          <h2 className="flex font-bold q-text-xl">Other Information</h2>
          <div className="flex w-full q-gap-5">
            <InputField
              labelText="Disability"
              placeholder="Enter disability (optional)"
              name="disability"
              value={data.disability || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
            <InputField
              labelText="Indigenous Group"
              placeholder="Enter indigenous group (optional)"
              name="indigenousGroup"
              value={data.indigenousGroup || ""}
              setValue={handleChange}
              type="text"
              attr="w-full"
              disabled={disabled}
            />
          </div>
        </div>
      )}
      {value === criteria[2] && (
        <div className="flex w-full flex-col items-center q-gap-5">
          <h2 className="flex font-bold q-text-xl">
            Family Information{!disabled && <p className="text-red-700">*</p>}
          </h2>
          <InputField
            labelText="Number of Siblings"
            placeholder="Enter number of siblings"
            name="numOfSiblings"
            value={data.numOfSiblings || ""}
            setValue={handleChange}
            type="number"
            attr="w-full type-"
            disabled={disabled}
          />
          <Combobox
            items={[
              "Below 11,000",
              "11,001 - 22,000",
              "22,001 - 43,000",
              "43,001 - 76,000",
              "76,001 - 131,000",
              "131,001 and above",
            ]}
            isSearchable={false}
            labelText="Income Bracket"
            placeholder="Enter your income bracket"
            name="incomeBracket"
            value={data.incomeBracket || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
          <h2 className="flex font-bold q-text-xl">
            Father&apos;s Information
            {!disabled && <p className="text-red-700">*</p>}
          </h2>
          <InputField
            labelText="Father's Name"
            placeholder="Enter your father's name"
            name="fatherName"
            value={data.fatherName || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="Father's Contact Number"
            placeholder="Enter your father's contact number"
            name="fatherContactNum"
            value={data.fatherContactNum || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="Father's Occupation"
            placeholder="Enter your father's occupation"
            name="fatherOccupation"
            value={data.fatherOccupation || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
          <h2 className="flex font-bold q-text-xl">
            Mother&apos;s Information
            {!disabled && <p className="text-red-700">*</p>}
          </h2>
          <InputField
            labelText="Mother's Name"
            placeholder="Enter your mother's name"
            name="motherName"
            value={data.motherName || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="Mother's Contact Number"
            placeholder="Enter your mother's contact number"
            name="motherContactNum"
            value={data.motherContactNum || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="Mother's Occupation"
            placeholder="Enter your mother's occupation"
            name="motherOccupation"
            value={data.motherOccupation || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
          <h2 className="flex font-bold q-text-xl">
            Guardian&apos;s Information
            {!disabled && <p className="text-red-700">*</p>}
          </h2>
          <InputField
            labelText="Guardian's Name"
            placeholder="Enter your guardian's name"
            name="guardianName"
            value={data.guardianName || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="Guardian's Contact Number"
            placeholder="Enter your guardian's contact number"
            name="guardianContactNum"
            value={data.guardianContactNum || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="Guardian's Occupation"
            placeholder="Enter your guardian's occupation"
            name="guardianOccupation"
            value={data.guardianOccupation || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
        </div>
      )}
      {value === criteria[3] && (
        <div className="flex w-full flex-col items-center q-gap-5">
          <h2 className="flex font-bold q-text-xl">
            Elementary School&apos;s Information
            {!disabled && <p className="text-red-700">*</p>}
          </h2>
          <InputField
            labelText="School Name"
            placeholder="Enter elementary school name"
            name="elementarySchoolName"
            value={data.elementarySchoolName || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="School Address"
            placeholder="Enter elementary school address"
            name="elementarySchoolAddress"
            value={data.elementarySchoolAddress || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <Combobox
            items={["Public", "Private"]}
            isSearchable={false}
            labelText="School Type"
            placeholder="Enter elementary school type"
            name="elementarySchoolType"
            value={data.elementarySchoolType || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="Year Graduated"
            placeholder="Enter year graduated"
            name="elementaryYearGraduated"
            value={data.elementaryYearGraduated || ""}
            setValue={handleChange}
            type="number"
            attr="w-full"
            disabled={disabled}
          />
          <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
          <h2 className="flex font-bold q-text-xl">
            Junior High School&apos;s Information
            {!disabled && <p className="text-red-700">*</p>}
          </h2>
          <InputField
            labelText="School Name"
            placeholder="Enter junior high school name"
            name="juniorHighSchoolName"
            value={data.juniorHighSchoolName || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="School Address"
            placeholder="Enter junior high school address"
            name="juniorHighSchoolAddress"
            value={data.juniorHighSchoolAddress || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <Combobox
            items={["Public", "Private"]}
            isSearchable={false}
            labelText="School Type"
            placeholder="Enter junior high school type"
            name="juniorHighSchoolType"
            value={data.juniorHighSchoolType || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="Year Graduated"
            placeholder="Enter year graduated"
            name="juniorHighYearGraduated"
            value={data.juniorHighYearGraduated || ""}
            setValue={handleChange}
            type="number"
            attr="w-full"
            disabled={disabled}
          />
          <div className="my-10 h-0.5 w-full rounded-full bg-tertiary" />
          <h2 className="flex font-bold q-text-xl">
            Senior High School&apos;s Information
            {!disabled && <p className="text-red-700">*</p>}
          </h2>
          <InputField
            labelText="School Name"
            placeholder="Enter senior high school name"
            name="seniorHighSchoolName"
            value={data.seniorHighSchoolName || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="School Address"
            placeholder="Enter senior high school address"
            name="seniorHighSchoolAddress"
            value={data.seniorHighSchoolAddress || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <Combobox
            items={["Public", "Private"]}
            isSearchable={false}
            labelText="School Type"
            placeholder="Enter senior high school type"
            name="seniorHighSchoolType"
            value={data.seniorHighSchoolType || ""}
            setValue={handleChange}
            type="text"
            attr="w-full"
            disabled={disabled}
          />
          <InputField
            labelText="Year Graduated"
            placeholder="Enter year graduated"
            name="seniorHighYearGraduated"
            value={data.seniorHighYearGraduated || ""}
            setValue={handleChange}
            type="number"
            attr="w-full"
            disabled={disabled}
          />
          {/* <InputField
                labelText="College School Name"
                placeholder="Enter college school name"
                name="colegeSchoolName"
                value={data.colegeSchoolName || ""}
                setValue={handleChange}
                type="text"
                attr="w-full"
								disabled={disabled}
              />
              <InputField
                labelText="College School Address"
                placeholder="Enter college school address"
                name="colegeSchoolAddress"
                value={data.colegeSchoolAddress || ""}
                setValue={handleChange}
                type="text"
                attr="w-full"
								disabled={disabled}
              />
              <InputField
                labelText="College School Type"
                placeholder="Enter college school type"
                name="colegeSchoolType"
                value={data.colegeSchoolType || ""}
                setValue={handleChange}
                type="text"
                attr="w-full"
								disabled={disabled}
              />
              <InputField
                labelText="College Year Graduated"
                placeholder="Enter year graduated"
                name="colegeYearGraduated"
                value={data.colegeYearGraduated || ""}
                setValue={handleChange}
                type="text"
                attr="w-full"
								disabled={disabled} 
              />
								*/}
        </div>
      )}
    </>
  );
}
