"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import Image from "next/image";

export default function FileComparison() {
  const [leftFileData, setLeftFileData] = useState(null);
  const [rightFileData, setRightFileData] = useState(null);
  const [leftFileName, setLeftFileName] = useState(""); // Sol dosya adı
  const [rightFileName, setRightFileName] = useState(""); // Sağ dosya adı
  const [comparisonResult, setComparisonResult] = useState(null);

  const normalizeString = (str) => {
    if (typeof str !== "string") {
      return ""; // Eğer veri string değilse boş string döndür
    }
    return str
      .toLowerCase()
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u")
      .replace(/[^a-z0-9\s]/g, "") // Diğer özel karakterleri kaldır
      .replace(/\s+/g, " ") // Birden fazla boşluğu tek boşluğa çevir
      .trim(); // Başındaki ve sonundaki boşlukları temizle
  };

  const handleFileUpload = (file, setFileData, setFileName) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      const extractedData = {};
      jsonData.forEach((row) => {
        const rowKey = normalizeString(row[Object.keys(row)[0]]);
        Object.keys(row).forEach((column) => {
          if (column !== Object.keys(row)[0]) {
            extractedData[`${rowKey}->${normalizeString(column)}`] =
              row[column];
          }
        });
      });
      setFileData(extractedData);
    };
    reader.readAsArrayBuffer(file);
    setFileName(file.name); // Dosya adını güncelle
  };

  const compareFiles = () => {
    if (!leftFileData || !rightFileData) return;

    const results = Object.keys(leftFileData).map((key) => {
      const leftValue = leftFileData[key];
      const normalizedKey = key.toLowerCase();
      const rightValue = rightFileData[normalizedKey] || "Sağ dosyada yok";
      return {
        key,
        leftValue,
        rightValue,
        isEqual: leftValue === rightValue,
      };
    });

    setComparisonResult(results);
  };

  const resetForm = () => {
    setLeftFileData(null);
    setRightFileData(null);
    setLeftFileName("");
    setRightFileName("");
    setComparisonResult(null);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-10">
      <div className="flex flex-col items-center rounded-lg p-8 max-w-4xl w-full">
        <Image
          className="rounded-full mb-4"
          src={"/images/bah-logo.png"}
          width={64}
          height={64}
          alt="logo"
        />
        <h1 className="flex flex-col items-center justify-center text-4xl font-bold mb-8 text-center text-red-700">
          <span className="text-3xl">Büyük Anadolu Hastanesi Darıca</span>
          Excel Dosya Karşılaştırma Aracı
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sol dosya yükleme bölümü */}
          <div className="text-center">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file-left"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                <div className="flex flex-col items-center justify-center w-full h-full pt-5 pb-6">
                  <svg
                    className={`w-8 h-8 mb-4 text-gray-500 ${
                      leftFileName && "hidden"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p
                    className={`mb-2 text-sm text-gray-500 px-4 ${
                      leftFileName ? "hidden" : ""
                    }`}
                  >
                    Dosyanızı buraya sürükleyin veya yüklemek için tıklayın
                  </p>
                  {/* Dosya adı burada gösterilecek */}
                  <p className="text-gray-700 font-semibold">{leftFileName}</p>
                </div>
                <input
                  id="dropzone-file-left"
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={(e) =>
                    handleFileUpload(
                      e.target.files[0],
                      setLeftFileData,
                      setLeftFileName
                    )
                  }
                />
              </label>
            </div>
          </div>

          {/* Sağ dosya yükleme bölümü */}
          <div className="text-center">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file-right"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                <div className="flex flex-col items-center justify-center w-full h-full pt-5 pb-6">
                  <svg
                    className={`w-8 h-8 mb-4 text-gray-500 ${
                      rightFileName && "hidden"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p
                    className={`mb-2 text-sm text-gray-500 ${
                      rightFileName ? "hidden" : ""
                    }`}
                  >
                    Dosyanızı buraya sürükleyin veya yüklemek için tıklayın
                  </p>
                  {/* Dosya adı burada gösterilecek */}
                  <p className="text-gray-700 font-semibold">{rightFileName}</p>
                </div>
                <input
                  id="dropzone-file-right"
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={(e) =>
                    handleFileUpload(
                      e.target.files[0],
                      setRightFileData,
                      setRightFileName
                    )
                  }
                  disabled={!leftFileData}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 text-center mt-8">
          <button
            disabled={!leftFileData || !rightFileData}
            onClick={compareFiles}
            className="relative inline-block group"
          >
            <span className="relative z-10 px-3.5 py-2 overflow-hidden font-medium leading-tight flex items-centrer justify-center text-red-700 transition-colors duration-300 ease-out border-2 border-red-700 rounded-lg group-hover:text-white">
              <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
              <span className="absolute left-0 w-40 h-40 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-red-700 group-hover:-rotate-180 ease"></span>
              <span className="relative text-base font-semibold">
                Karşılaştır
              </span>
            </span>
            <span
              class="absolute bottom-0 right-0 w-full h-9 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-red-700 rounded-lg group-hover:mb-0 group-hover:mr-0 group-hover:mb-2"
              data-rounded="rounded-lg"
            ></span>
          </button>

          <button onClick={resetForm} className="relative inline-block group">
            <span className="relative z-10 px-3.5 py-2 overflow-hidden font-medium leading-tight flex items-centrer justify-center text-black transition-colors duration-300 ease-out border-2 border-black rounded-lg group-hover:text-white">
              <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
              <span className="absolute left-0 w-40 h-40 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-black group-hover:-rotate-180 ease"></span>
              <span className="relative text-base font-semibold">Sıfırla</span>
            </span>
            <span
              class="absolute bottom-0 right-0 w-full h-9 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-black rounded-lg group-hover:mb-0 group-hover:mr-0 group-hover:mb-2"
              data-rounded="rounded-lg"
            ></span>
          </button>
        </div>

        <div className="mt-10 rounded-lg overflow-x-auto">
          {comparisonResult ? (
            <table className="min-w-full w-full table-auto bg-white shadow-lg rounded-lg">
              <thead className="rounded-lg">
                <tr className="bg-gradient-to-r from-red-800 to-red-300 text-white">
                  <th className="py-2 px-2 sm:py-3 sm:px-4 text-left">Key</th>
                  <th className="py-2 px-2 sm:py-3 sm:px-4 text-left">
                    Sol Dosya
                  </th>
                  <th className="py-2 px-2 sm:py-3 sm:px-4 text-left">
                    Sağ Dosya
                  </th>
                  <th className="py-2 px-2 sm:py-3 sm:px-4 text-left">Durum</th>
                </tr>
              </thead>
              <tbody>
                {comparisonResult.map((result, index) => (
                  <tr
                    key={index}
                    className={`transition-all duration-300 ease-in-out ${
                      result.isEqual
                        ? "bg-green-100 hover:bg-green-200"
                        : "bg-red-100 hover:bg-red-200"
                    }`}
                  >
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-800 text-sm">
                      {result.key}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-800 text-sm">
                      {result.leftValue}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-800 text-sm">
                      {result.rightValue}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-800 text-sm flex items-center">
                      {result.isEqual ? (
                        <span className="flex items-center gap-1 sm:gap-2">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Eşleşti
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 sm:gap-2">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Farklı
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center mt-4">
              Henüz karşılaştırma yapılmadı.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
