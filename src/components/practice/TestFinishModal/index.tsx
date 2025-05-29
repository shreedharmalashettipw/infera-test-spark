import { useQueryParam } from "@/hooks/useQueryParam";
import React from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti"; // Import Confetti

const TestFinishModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();
  const testId = useQueryParam("testId") as string;
  const userId = useQueryParam("userId") as string;

  const handleNavigateToAnalytics = () => {
    navigate(`/analytics?testId=${testId}&userId=${userId}`);
    closeModal();
  };

  return (
    <>
      {isOpen && (
        <Confetti
          width={window.innerWidth} // Full-screen width
          height={window.innerHeight} // Full-screen height
          numberOfPieces={200} // Number of confetti pieces
        />
      )}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Test Finish Modal"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            padding: "30px",
            borderRadius: "12px",
            width: "600px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            zIndex: 1050,
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 1040,
            backdropFilter: "blur(2px)",
          },
        }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Congratulations!
          </h2>
          <p className="text-gray-600 mb-8">
            Bravo! You’ve successfully completed the test. Great job on your
            effort and dedication!
          </p>
          <button
            onClick={() => {
              handleNavigateToAnalytics();
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Go to Analytics
          </button>
        </div>
      </Modal>
    </>
  );
};

export default TestFinishModal;
