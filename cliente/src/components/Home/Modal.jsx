import React, { useEffect, useRef } from "react";

const Modal = ({ isOpen, closeModal, content, style, title, bg }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.classList.contains("modal-content")
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [closeModal]);

  return (
    <>
      {isOpen && (
        <div className={`fixed inset-0 flex items-center z-[100] ${bg} `}>
          <div ref={modalRef} className={style}>
            <div className="w-full relative py-4 flex justify-center border-b-2 dark:border-white/10 border-gray-100">
              <p className="text-center dark:text-white">{title}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer absolute left-10 dark:stroke-white"
                onClick={closeModal}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
