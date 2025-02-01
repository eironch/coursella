import { useState } from "react";
import PropTypes from "prop-types";

Table.propTypes = {
  columnNames: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  removeWhere: PropTypes.array.isRequired,
  compressedAt: PropTypes.number.isRequired,
  searchParams: PropTypes.array.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  thClassMap: PropTypes.object.isRequired,
  tdClassMap: PropTypes.object.isRequired,
  setTargetId: PropTypes.func,
  setModalOpen: PropTypes.func,
};

export default function Table({
  columnNames,
  data,
  removeWhere,
  compressedAt,
  searchParams,
  setSearchParams,
  thClassMap,
  tdClassMap,
  setTargetId,
  setModalOpen,
}) {
  const [showCompressed, setShowCompressed] = useState(false);

  function handleReviewRow(targetId) {
    setModalOpen(true);
    setTargetId(targetId);
  }

  return (
    <div className="scrollable-div overflow-x-auto md:w-full">
      <table className="flex w-[600px] flex-col gap-5 text-tertiary md:w-full">
        <thead className="flex w-full">
          <tr className="flex w-full items-center overflow-hidden rounded-2xl bg-secondary q-text-sm">
            {columnNames
              .filter(
                (_, index) =>
                  index < removeWhere[0] ||
                  index > removeWhere[1] ||
                  showCompressed,
              )
              .map((name, index) => (
                <th
                  className={`${(thClassMap && thClassMap[name]) || "flex-1"} ${searchParams.includes(name) && "bg-highlight text-primary"} flex h-full w-full cursor-pointer items-center justify-center py-5 hover:bg-highlight-light hover:text-primary`}
                  key={index}
                  dangerouslySetInnerHTML={{ __html: name }}
                  onClick={() =>
                    setSearchParams((prev) =>
                      prev.some((param) => param === name)
                        ? prev.filter((param) => param !== name)
                        : [...prev, name],
                    )
                  }
                ></th>
              ))}
          </tr>
        </thead>
        <tbody className="flex w-full flex-col">
          {data.map((row, rowIndex) => (
            <tr
              className={`${setTargetId ? "cursor-pointer" : "cursor-default"} ${data.length !== rowIndex + 1 && "border-b-2"} flex w-full items-center rounded-t-2xl py-4 text-center q-text-sm hover:bg-secondary`}
              key={rowIndex}
              onClick={() =>
                setModalOpen && handleReviewRow(Object.values(row)[0])
              }
            >
              {Object.entries(row)
                .filter(
                  (_, index) =>
                    index < removeWhere[0] ||
                    index > removeWhere[1] ||
                    showCompressed,
                )
                .map(([key, value], index) =>
                  index !== compressedAt ? (
                    <td
                      className={`${(tdClassMap && tdClassMap[key]) || "flex-1"} w-full`}
                      key={key + value}
                    >
                      {value}
                    </td>
                  ) : (
                    [
                      <td
                        className="w-10 max-w-10 flex-1"
                        key={key + value + "compressed"}
                      />,
                      <td
                        className={`${(tdClassMap && tdClassMap[key]) || "flex-1"} w-full`}
                        key={key + value}
                      >
                        {value}
                      </td>,
                    ]
                  ),
                )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
