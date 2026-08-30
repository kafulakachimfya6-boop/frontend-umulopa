import { FaFilePdf, FaFileExcel } from "react-icons/fa";

function ReportActions({ onPdf, onExcel }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onPdf}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#6B0F1A] shadow-sm transition hover:bg-gray-50"
      >
        <FaFilePdf /> PDF
      </button>
      <button
        type="button"
        onClick={onExcel}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-[#6B0F1A] shadow-sm transition hover:bg-gray-50"
      >
        <FaFileExcel /> Excel
      </button>
    </div>
  );
}

export default ReportActions;
