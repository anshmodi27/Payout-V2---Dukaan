"use client";
import { useAtom } from "jotai";
import { headerTextAtom } from "../components/Navbar";
import { useEffect, useState } from "react";
import OverviewCard from "../components/OverviewCard";
import { Orders, Total } from "../constant/contant";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const page = () => {
  // Update the header text for this specific page
  const [, setHeaderText] = useAtom(headerTextAtom);
  useEffect(() => {
    setHeaderText("Payments");
    return () => {
      // Reset the header text when the component unmounts
      setHeaderText("Home");
    };
  }, [setHeaderText]);

  // Dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Last Month");
  const options = ["Last Month", "Last 3 Months", "Last 6 Months"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    // Do something with the selected option, like triggering an action or updating state
  };

  // Pagination
  const itemsPerPage = 10;
  function paginate(array, currentPage) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return array.slice(startIndex, startIndex + itemsPerPage);
  }

  const [currentPage, setCurrentPage] = useState(1);
  const paginatedData = paginate(Orders, currentPage);
  const totalPages = Math.ceil(Orders.length / itemsPerPage);

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  function searchByOrderID(array, id) {
    return array.filter((item) =>
      item.OrderID.toString().includes(id.toString())
    );
  }

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const results = term.trim() === "" ? [] : searchByOrderID(Orders, term);
    setSearchResults(results);
  };

  // Table to Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(Orders);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(excelBlob, "table_data.xlsx");
  };

  return (
    <>
      {/* header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[20px] text-[#1a181e] font-medium">Overview</h3>
        <div className="relative cursor-pointer">
          <div
            className="bg-white border border-[#d9d9d9] p-2 rounded-[4px] flex items-center justify-center gap-[4px]"
            onClick={toggleDropdown}
          >
            <p className="text-[#1a181e] text-[16px] font-normal">
              {selectedOption}
            </p>
            {isOpen ? (
              <span className="rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M2.27748 5.77748C2.61381 5.44114 3.14013 5.41057 3.511 5.68575L3.61726 5.77748L8 10.1598L12.3827 5.77748C12.7191 5.44114 13.2454 5.41057 13.6163 5.68575L13.7225 5.77748C14.0589 6.11381 14.0894 6.64013 13.8142 7.011L13.7225 7.11726L8.66989 12.1699C8.33355 12.5062 7.80724 12.5368 7.43636 12.2616L7.33011 12.1699L2.27748 7.11726C1.90751 6.74729 1.90751 6.14745 2.27748 5.77748Z"
                    fill="#4D4D4D"
                  />
                </svg>
              </span>
            ) : (
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M2.27748 5.77748C2.61381 5.44114 3.14013 5.41057 3.511 5.68575L3.61726 5.77748L8 10.1598L12.3827 5.77748C12.7191 5.44114 13.2454 5.41057 13.6163 5.68575L13.7225 5.77748C14.0589 6.11381 14.0894 6.64013 13.8142 7.011L13.7225 7.11726L8.66989 12.1699C8.33355 12.5062 7.80724 12.5368 7.43636 12.2616L7.33011 12.1699L2.27748 7.11726C1.90751 6.74729 1.90751 6.14745 2.27748 5.77748Z"
                    fill="#4D4D4D"
                  />
                </svg>
              </span>
            )}
          </div>
          {/* Dropdown */}
          <div
            className={
              "origin-top absolute mx-auto right-0 left-0 mt-2 w-full rounded-md shadow-lg backdrop-blur bg-white/70 focus:outline-none transition-all duration-500 " +
              (isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0")
            }
          >
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className="block w-full text-left px-4 py-2 text-sm text-[#000] hover:bg-[#000]/20"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="grid grid-cols-2 gap-5 mt-6 mb-8">
        {Total.map((item, index) => (
          <OverviewCard title={item.title} value={item.value} key={index} />
        ))}
      </div>

      {/* Transaction */}
      <div>
        {/* title */}
        <div className="flex items-center justify-start gap-2">
          <p>Transaction</p> <span>|</span> <p>{selectedOption}</p>
        </div>
        {/* content */}
        <div className="bg-white shadow-[0_2px_6px_0_rgba(26,24,30,0.1)] p-5 rounded-[8px] mt-5">
          {/* Content header */}
          <div className="flex items-center justify-between mb-3">
            <div className="">
              <div className="w-[248px] h-[40px] px-[16px] py-[9px] border bg-[#fff] rounded-[6px] flex items-center justify-centers gap-2">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <g clip-path="url(#clip0_12602_2526)">
                      <path
                        d="M6.8 12.0301C3.9328 12.0301 1.6 9.69143 1.6 6.81704C1.6 3.94266 3.9328 1.60401 6.8 1.60401C9.6672 1.60401 12 3.94266 12 6.81704C12 9.69143 9.6672 12.0301 6.8 12.0301ZM12.2792 10.8375C13.1056 9.70827 13.6 8.3216 13.6 6.81704C13.6 3.05805 10.5496 0 6.8 0C3.0504 0 0 3.05805 0 6.81704C0 10.576 3.0504 13.6341 6.8 13.6341C8.4728 13.6341 10.0048 13.0222 11.1896 12.0132L14.0032 14.8339C14.1592 14.9903 14.364 15.0689 14.5688 15.0689C14.7736 15.0689 14.9784 14.9903 15.1344 14.8339C15.4472 14.5203 15.4472 14.0134 15.1344 13.6999L12.2792 10.8375Z"
                        fill="#808080"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_12602_2526">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <input
                  type="text"
                  className="w-full bg-transparent outline-none text-[15px] text-[#808080]"
                  placeholder="Search by order ID..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="cursor-pointer bg-white border border-[#d9d9d9] p-2 rounded-[4px] flex items-center justify-center gap-[4px]">
                <p className="text-[#1a181e] text-[16px] font-normal">Sort</p>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1.62301 9.93375C1.83129 9.72547 2.16897 9.72547 2.37725 9.93375L4.641 12.1975L6.90474 9.93375C7.11302 9.72547 7.45071 9.72547 7.65899 9.93375C7.86727 10.142 7.86727 10.4797 7.65899 10.688L5.01812 13.3289C4.80984 13.5371 4.47215 13.5371 4.26387 13.3289L1.62301 10.688C1.41473 10.4797 1.41473 10.142 1.62301 9.93375Z"
                      fill="#4D4D4D"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.64095 2.51515C4.9355 2.51515 5.17428 2.75393 5.17428 3.04849L5.17428 12.9517C5.17428 13.2463 4.9355 13.4851 4.64095 13.4851C4.3464 13.4851 4.10762 13.2463 4.10762 12.9517L4.10762 3.04849C4.10762 2.75393 4.3464 2.51515 4.64095 2.51515Z"
                      fill="#4D4D4D"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M14.3772 6.06646C14.169 6.27474 13.8313 6.27474 13.623 6.06646L11.3592 3.80272L9.0955 6.06646C8.88722 6.27474 8.54953 6.27474 8.34126 6.06646C8.13298 5.85818 8.13298 5.52049 8.34126 5.31221L10.9821 2.67135C11.1904 2.46307 11.5281 2.46307 11.7364 2.67135L14.3772 5.31221C14.5855 5.52049 14.5855 5.85818 14.3772 6.06646Z"
                      fill="#4D4D4D"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.3593 13.4851C11.0647 13.4851 10.826 13.2463 10.826 12.9517L10.826 3.04847C10.826 2.75392 11.0647 2.51514 11.3593 2.51514C11.6538 2.51514 11.8926 2.75392 11.8926 3.04847L11.8926 12.9517C11.8926 13.2463 11.6538 13.4851 11.3593 13.4851Z"
                      fill="#4D4D4D"
                    />
                  </svg>
                </span>
              </div>
              <div
                onClick={exportToExcel}
                className="cursor-pointer bg-white border border-[#d9d9d9] p-2.5 rounded-[4px] flex items-center justify-center gap-[4px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M17.9993 11.9414C18.371 11.9414 18.6811 12.2102 18.7435 12.5968L18.75 12.7L18.7495 16.2321C18.7495 17.5585 17.7164 18.655 16.3813 18.7448L16.2153 18.75L3.77794 18.7499C2.44615 18.7499 1.34529 17.7208 1.25525 16.391L1.25 16.2258V12.6863C1.25 12.2749 1.58596 11.9414 2.00027 11.9414C2.37194 11.9414 2.68197 12.2102 2.74442 12.5968L2.75092 12.7L2.75044 16.2321C2.75044 16.7555 3.14596 17.2013 3.65248 17.2534L3.76695 17.2599L16.2217 17.2602C16.7449 17.2602 17.1902 16.8642 17.2423 16.3577L17.2489 16.2429L17.2492 12.6863C17.2492 12.2749 17.585 11.9414 17.9993 11.9414ZM10.0121 1.25C10.3715 1.25038 10.6815 1.51921 10.744 1.90576L10.7505 2.00892L10.7512 10.8297L13.9124 7.67494C14.1433 7.44469 14.4923 7.39342 14.7961 7.54761L14.9083 7.61495L14.9846 7.68297C15.2334 7.92976 15.2646 8.33058 15.0409 8.65049L14.9652 8.73721L10.5142 13.1745L10.4327 13.2409L10.3271 13.3035L10.2368 13.3399L10.155 13.3617L10.0754 13.374L10.0133 13.3765L9.89007 13.3697L9.78548 13.3471L9.70291 13.3166L9.6007 13.2643L9.54241 13.2224L9.4569 13.1479L5.02399 8.726C4.73169 8.43447 4.73275 7.96287 5.02636 7.67264C5.28648 7.41551 5.69029 7.38633 6.01149 7.60986L6.09848 7.68534L9.25064 10.8296L9.24964 1.9952C9.24964 1.61868 9.53272 1.30251 9.90546 1.25619L10.0121 1.25Z"
                    fill="#4D4D4D"
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* Table */}
          <div className="">
            <table className="w-full border-collapse rounded-[4px] relative">
              <thead className="sticky top-0 bg-[#F2F2F2] text-[#4D4D4D] text-[14px] font-normal rounded-[4px] overflow-hidden">
                <tr>
                  <th className="text-left py-2.5 pl-5 rounded-l-[4px]">
                    Order ID
                  </th>
                  <th className="text-center py-2.5">
                    <div className="flex items-center justify-center gap-2">
                      <p>Order Date</p>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="8"
                          viewBox="0 0 8 8"
                          fill="none"
                        >
                          <path
                            d="M3.43025 6.23409L0.606918 2.3286C0.548707 2.24507 0.517907 2.15037 0.517581 2.05392C0.517255 1.95746 0.547415 1.86262 0.60506 1.77882C0.662705 1.69502 0.745826 1.62519 0.846154 1.57627C0.946481 1.52736 1.06052 1.50106 1.17692 1.5H6.82358C6.93998 1.50106 7.05402 1.52736 7.15435 1.57627C7.25468 1.62519 7.3378 1.69502 7.39544 1.77882C7.45309 1.86262 7.48325 1.95746 7.48292 2.05392C7.4826 2.15037 7.45179 2.24507 7.39358 2.3286L4.57025 6.23409C4.51083 6.31526 4.42716 6.38238 4.32732 6.42895C4.22747 6.47553 4.11483 6.5 4.00025 6.5C3.88567 6.5 3.77303 6.47553 3.67319 6.42895C3.57334 6.38238 3.48967 6.31526 3.43025 6.23409Z"
                            fill="#4D4D4D"
                          />
                        </svg>
                      </span>
                    </div>
                  </th>
                  <th className="text-center py-2.5">Order Amount</th>
                  <th className="text-right py-2.5 pr-5 rounded-r-[4px]">
                    <div className="flex items-center justify-end gap-2">
                      <p>Transaction Fee</p>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_0_5817)">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.0002 1.63353C4.03627 1.63353 1.63353 4.03627 1.63353 7.0002C1.63353 9.96412 4.03627 12.3669 7.0002 12.3669C9.96412 12.3669 12.3669 9.96412 12.3669 7.0002C12.3669 4.03627 9.96412 1.63353 7.0002 1.63353ZM0.700195 7.0002C0.700195 3.5208 3.5208 0.700195 7.0002 0.700195C10.4796 0.700195 13.3002 3.5208 13.3002 7.0002C13.3002 10.4796 10.4796 13.3002 7.0002 13.3002C3.5208 13.3002 0.700195 10.4796 0.700195 7.0002Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.00019 6.62382C7.25793 6.62382 7.46686 6.83275 7.46686 7.09049L7.46687 9.44604C7.46687 9.70377 7.25794 9.9127 7.00021 9.9127C6.74247 9.9127 6.53354 9.70377 6.53354 9.44604L6.53353 7.09049C6.53353 6.83276 6.74246 6.62382 7.00019 6.62382Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.52801 4.75852C7.52801 5.05002 7.29171 5.28633 7.00021 5.28633C6.70871 5.28633 6.4724 5.05002 6.4724 4.75852C6.4724 4.46702 6.70871 4.23072 7.00021 4.23072C7.29171 4.23072 7.52801 4.46702 7.52801 4.75852Z"
                              fill="#4D4D4D"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_0_5817">
                              <rect width="14" height="14" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              {searchResults.length > 0 ? (
                searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <tr className="border-b border-[#E5E5E5]" key={item}>
                      <td className="text-[#146EB4] font-medium text-left py-2.5 pl-5">
                        {item.OrderID}
                      </td>
                      <td className="text-[#1A181E] font-normal text-center py-2.5">
                        {item.Date}
                      </td>
                      <td className="text-[#1A181E] font-normal text-center py-2.5">
                        ₹{item.Amount}
                      </td>
                      <td className="text-[#1A181E] font-normal text-right py-2.5 pr-5">
                        ₹{item.TransactionFee}
                      </td>
                    </tr>
                  ))
                ) : (
                  <div>No results found</div>
                )
              ) : (
                <tbody className="text-[14px]">
                  {paginatedData.map((item, index) => (
                    <tr className="border-b border-[#E5E5E5]" key={index}>
                      <td className="text-[#146EB4] font-medium text-left py-2.5 pl-5">
                        {item.OrderID}
                      </td>
                      <td className="text-[#1A181E] font-normal text-center py-2.5">
                        {item.Date}
                      </td>
                      <td className="text-[#1A181E] font-normal text-center py-2.5">
                        ₹{item.Amount}
                      </td>
                      <td className="text-[#1A181E] font-normal text-right py-2.5 pr-5">
                        ₹{item.TransactionFee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Pagination */}
          <div className="my-">
            <div className="flex items-center justify-center gap-x-5 mt-10">
              <div
                onClick={() =>
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                }
                disabled={currentPage === 1}
                className="cursor-pointer bg-white border border-[#d9d9d9] px-2 py-1 rounded-[4px] flex items-center justify-center gap-[4px]"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.7803 3.96967C11.4874 3.67678 11.0126 3.67678 10.7197 3.96967L6.21967 8.46967C6.07902 8.61032 6 8.80109 6 9C6 9.19891 6.07902 9.38968 6.21967 9.53033L10.7197 14.0303C11.0126 14.3232 11.4874 14.3232 11.7803 14.0303C12.0732 13.7374 12.0732 13.2626 11.7803 12.9697L7.81066 9L11.7803 5.03033C12.0732 4.73744 12.0732 4.26256 11.7803 3.96967Z"
                      fill="#4D4D4D"
                    />
                  </svg>
                </span>
                <p className="text-[#1a181e] text-[14px] font-normal">
                  Previous
                </p>
              </div>
              <div className="text-[#4D4D4D] text-[14px] font-normal">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    // style={{
                    //   fontWeight: currentPage === index + 1 ? "bold" : "normal",
                    //   marginRight: "5px",
                    // }}
                    className={
                      "mr-5 py-1 px-1.5 " +
                      (currentPage === index + 1
                        ? "font-medium bg-[#146EB4] text-white rounded w-7 h-7"
                        : "")
                    }
                  >
                    <p>{index + 1}</p>
                  </button>
                ))}
              </div>
              <div
                onClick={() =>
                  setCurrentPage((prevPage) =>
                    Math.min(
                      prevPage + 1,
                      Math.ceil(Orders.length / itemsPerPage)
                    )
                  )
                }
                disabled={
                  currentPage === Math.ceil(Orders.length / itemsPerPage)
                }
                className="cursor-pointer bg-white border border-[#d9d9d9] px-2 py-1 rounded-[4px] flex items-center justify-center gap-[4px]"
              >
                <p className="text-[#1a181e] text-[16px] font-normal">Next</p>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.21967 3.96967C6.51256 3.67678 6.98744 3.67678 7.28033 3.96967L11.7803 8.46967C11.921 8.61032 12 8.80109 12 9C12 9.19891 11.921 9.38968 11.7803 9.53033L7.28033 14.0303C6.98744 14.3232 6.51256 14.3232 6.21967 14.0303C5.92678 13.7374 5.92678 13.2626 6.21967 12.9697L10.1893 9L6.21967 5.03033C5.92678 4.73744 5.92678 4.26256 6.21967 3.96967Z"
                      fill="#4D4D4D"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default page;
