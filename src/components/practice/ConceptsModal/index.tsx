import React from "react";
import Modal from "react-modal";
import { usePractice } from "@/contexts/PracticeContext";
import { useQueryParam } from "@/hooks/useQueryParam";

const ConceptsModal = ({
  closeModal,
  isOpen,
  journeyItems,
  currentJourneyItem,
}) => {
  const testId = useQueryParam("testId") as string;
  const { fetchNextQuestion, state } = usePractice();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Journey Items Modal"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          borderRadius: "12px",
          width: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          zIndex: 1050,
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1040,
        },
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Journey Items</h2>
        <button
          onClick={closeModal}
          className="text-gray-600 hover:text-gray-800 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {journeyItems
          .filter((item) => item._id !== currentJourneyItem._id)
          .filter((item) => !item.isCompleted)
          .map((item) => (
            <div
              key={item._id}
              className="p-4 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition duration-200 cursor-pointer"
              onClick={() => {
                fetchNextQuestion(testId, item.title);
                closeModal();
              }}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.note}</p>
            </div>
          ))}
      </div>
    </Modal>
  );
};

export default ConceptsModal;
