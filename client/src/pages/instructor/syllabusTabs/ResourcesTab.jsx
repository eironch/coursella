import PropTypes from "prop-types";

import AddPrimary from "../../../assets/add-primary.svg";
import DeletePrimary from "../../../assets/delete-primary.svg";

import InputField from "../../../components/InputField.jsx";

ResourcesTab.propTypes = {
  selectedRefBook: PropTypes.object.isRequired,
  setSelectedRefBook: PropTypes.func.isRequired,
  refBooks: PropTypes.array.isRequired,
  setRefBooks: PropTypes.func.isRequired,
  selectedPrevModule: PropTypes.object.isRequired,
  setSelectedPrevModule: PropTypes.func.isRequired,
  prevModules: PropTypes.array.isRequired,
  setPrevModules: PropTypes.func.isRequired,
  selectedWebRef: PropTypes.object.isRequired,
  setSelectedWebRef: PropTypes.func.isRequired,
  webRefs: PropTypes.array.isRequired,
  setWebRefs: PropTypes.func.isRequired,
  isEditable: PropTypes.bool.isRequired,
};

export default function ResourcesTab({
  selectedRefBook,
  setSelectedRefBook,
  refBooks,
  setRefBooks,
  selectedPrevModule,
  setSelectedPrevModule,
  prevModules,
  setPrevModules,
  selectedWebRef,
  setSelectedWebRef,
  webRefs,
  setWebRefs,
  isEditable,
}) {
  return (
    <div className="flex w-full flex-col gap-10">
      <h2 className="flex w-full justify-center font-bold q-text-xl">
        References & Supplementary Readings
      </h2>
      <div className="border-2 p-5 q-rounded-2xl">
        <table className="flex w-full flex-col gap-5 text-tertiary">
          <thead className="flex w-full">
            <tr className="flex w-full items-center rounded-2xl bg-secondary q-text-sm">
              <th className="w-full flex-[4] py-5">Reference Books</th>
             {isEditable &&  <th className="w-full flex-[1] py-5">Action</th>}
            </tr>
          </thead>
          <tbody className="flex w-full flex-col">
            {isEditable && (
              <tr className="mb-5 flex w-full items-center border-2 border-highlight-light py-4 text-center q-text-sm q-rounded-2xl">
                <td className="w-full flex-[4]">
                  <div className="px-2">
                    <InputField
                      labelText=""
                      placeholder="Enter reference book"
                      name="referenceBook"
                      value={selectedRefBook.refBook}
                      setValue={(e) => setSelectedRefBook(prev => ({...prev, refBook: e.target.value}))}
                      type="text"
                      attr="w-full"
                      disabled={!isEditable}
                    />
                  </div>
                </td>
                <td className="w-full flex-[1]">
                  <button
                    className="rounded-xl bg-highlight p-3 hover:bg-highlight-light disabled:bg-tertiary disabled:opacity-50"
                    onClick={() => {
                      setRefBooks((prev) => [...prev, selectedRefBook]);
                      setSelectedRefBook({});
                    }}
                    disabled={!selectedRefBook}
                  >
                    <img className="w-4" src={AddPrimary} />
                  </button>
                </td>
              </tr>
            )}
            {refBooks.map((value, index) => (
              <tr
                className={`${refBooks.length !== index + 1 && "border-b-2"} flex w-full items-center py-4 text-center q-text-sm`}
                key={index}
              >
                <td className="w-full flex-[4]">
                  <div className="px-2">{value.refBook}</div>
                </td>
                {isEditable && (
                  <td className="w-full flex-[1]">
                    <button
                      className="rounded-xl bg-red-600 p-3 hover:bg-red-500"
                      onClick={() =>
                        setRefBooks((prev) => {
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
      <div className="border-2 p-5 q-rounded-2xl">
        <table className="flex w-full flex-col gap-5 text-tertiary">
          <thead className="flex w-full">
            <tr className="flex w-full items-center rounded-2xl bg-secondary q-text-sm">
              <th className="w-full flex-[4] py-5">
                Previous Syllabus / Module
              </th>
             {isEditable &&  <th className="w-full flex-[1] py-5">Action</th>}
            </tr>
          </thead>
          <tbody className="flex w-full flex-col">
            {isEditable && (
              <tr className="mb-5 flex w-full items-center border-2 border-highlight-light py-4 text-center q-text-sm q-rounded-2xl">
                <td className="w-full flex-[4]">
                  <div className="px-2">
                    <InputField
                      labelText=""
                      placeholder="Enter previous syllabus / module"
                      name="prevModule"
                      value={selectedPrevModule.prevModule}
                      setValue={(e) => setSelectedPrevModule(prev => ({...prev, prevModule: e.target.value}))}
                      type="text"
                      attr="w-full"
                      disabled={!isEditable}
                    />
                  </div>
                </td>
                <td className="w-full flex-[1]">
                  <button
                    className="rounded-xl bg-highlight p-3 hover:bg-highlight-light disabled:bg-tertiary disabled:opacity-50"
                    onClick={() => {
                      setPrevModules((prev) => [...prev, selectedPrevModule]);
                      setSelectedPrevModule({});
                    }}
                    disabled={!selectedPrevModule}
                  >
                    <img className="w-4" src={AddPrimary} />
                  </button>
                </td>
              </tr>
            )}
            {prevModules.map((value, index) => (
              <tr
                className={`${prevModules.length !== index + 1 && "border-b-2"} flex w-full items-center py-4 text-center q-text-sm`}
                key={index}
              >
                <td className="w-full flex-[4]">
                  <div className="px-2">{value.prevModule}</div>
                </td>
                {isEditable && (
                  <td className="w-full flex-[1]">
                    <button
                      className="rounded-xl bg-red-600 p-3 hover:bg-red-500"
                      onClick={() =>
                        setPrevModules((prev) => {
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
      <div className="border-2 p-5 q-rounded-2xl">
        <table className="flex w-full flex-col gap-5 text-tertiary">
          <thead className="flex w-full">
            <tr className="flex w-full items-center rounded-2xl bg-secondary q-text-sm">
              <th className="w-full flex-[4] py-5">Web References</th>
             {isEditable &&  <th className="w-full flex-[1] py-5">Action</th>}
            </tr>
          </thead>
          <tbody className="flex w-full flex-col">
            {isEditable && (
              <tr className="mb-5 flex w-full items-center border-2 border-highlight-light py-4 text-center q-text-sm q-rounded-2xl">
                <td className="w-full flex-[4]">
                  <div className="px-2">
                    <InputField
                      labelText=""
                      placeholder="Enter web reference"
                      name="webReference"
                      value={selectedWebRef.webRef}
                      setValue={(e) => setSelectedWebRef(prev => ({...prev, webRef: e.target.value}))}
                      type="text"
                      attr="w-full"
                      disabled={!isEditable}
                    />
                  </div>
                </td>
                {isEditable && (
                  <td className="w-full flex-[1]">
                    <button
                      className="rounded-xl bg-highlight p-3 hover:bg-highlight-light disabled:bg-tertiary disabled:opacity-50"
                      onClick={() => {
                        setWebRefs((prev) => [...prev, selectedWebRef]);
                        setSelectedWebRef({});
                      }}
                      disabled={!selectedWebRef}
                    >
                      <img className="w-4" src={AddPrimary} />
                    </button>
                  </td>
                )}
              </tr>
            )}
            {webRefs.map((value, index) => (
              <tr
                className={`${webRefs.length !== index + 1 && "border-b-2"} flex w-full items-center py-4 text-center q-text-sm`}
                key={index}
              >
                <td className="w-full flex-[4] break-all">
                  <div className="px-2">{value.webRef}</div>
                </td>
                {isEditable && (
                  <td className="w-full flex-[1]">
                    <button
                      className="rounded-xl bg-red-600 p-3 hover:bg-red-500"
                      onClick={() =>
                        setWebRefs((prev) => {
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
  );
}
