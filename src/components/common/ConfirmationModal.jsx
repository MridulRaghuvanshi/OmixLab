import IconBtn from "./IconBtn"

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[350px] rounded-lg border border-[rgb(82,82,91)] bg-[rgb(24,24,27)] p-6">
      <p className="text-2xl font-semibold text-[rgb(244,244,245)]">
          {modalData?.text1}
        </p>
        <p className="mt-3 mb-5 leading-6 text-[rgb(148,163,184)]">
          {modalData?.text2}
        </p>
        <div className="flex items-center gap-x-4">
          <IconBtn
            onclick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
          />
          <button
           className="cursor-pointer rounded-md bg-[rgb(148,163,184)] py-[8px] px-[20px] font-semibold text-[rgb(24,24,27)]"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  )
}