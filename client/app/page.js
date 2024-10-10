"use client";
import { useState } from "react";

export default function Home() {
  const [leftFile, setLeftFile] = useState(null);
  const [rightFile, setRightFile] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleCompare = async () => {
    const formData = new FormData();
    formData.append("left_file", leftFile);
    formData.append("right_file", rightFile);

    const response = await fetch("http://localhost:8000/compare", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setComparisonResult(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-24">
      <h1 className="flex text-red-700 text-4xl font-bold mb-12 text-center">
        Excel Karşılaştırıcı
      </h1>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="flex justify-between gap-16 w-full">
          <div className="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-400  px-12 text-center">
                  <span class="font-semibold">
                    Doğruluğundan emin olduğun Excel(xlsx) dosyasını yüklemek
                  </span>
                  veya sürükleyip bırakmak için tıklayın!
                </p>
                <p className="text-xs text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e, setLeftFile)}
              />
            </label>
          </div>
          <div className="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-400 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-400  px-12 text-center">
                  <span class="font-semibold">
                    Doğruluğundan emin olduğun Excel(xlsx) dosyasını yüklemek
                  </span>
                  veya sürükleyip bırakmak için tıklayın!
                </p>
                <p className="text-xs text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e, setRightFile)}
              />
            </label>
          </div>
        </div>
        <button
          onClick={handleCompare}
          className="bg-red-700 text-white px-4 py-2 rounded-lg mt-4 w-1/2"
        >
          Compare
        </button>

        {comparisonResult && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Karşılaştırma Sonucu:</h2>
            <div>
              <h3 className="mt-4 font-bold">
                Solda olup sağda olmayan veriler:
              </h3>
              <pre>
                {JSON.stringify(comparisonResult.only_in_left, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="mt-4 font-bold">
                Sağda olup solda olmayan veriler:
              </h3>
              <pre>
                {JSON.stringify(comparisonResult.only_in_right, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
