import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdCalendarToday, MdKeyboardArrowDown } from "react-icons/md";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import {
  getDefaultStartDate,
  getDefaultEndDate,
} from "../../../../utils/dateUtils";

/**
 * Helper function to format date as YYYY-MM-DD in local timezone
 * Avoids UTC conversion issues with toISOString()
 */
const formatDateLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * DateRangeFilter Component
 * Customized dropdown date picker matching JetStay application style
 * @param {Object} props
 * @param {Function} props.onDateRangeChange - Callback when date range changes
 * @param {Object} props.initialRange - Initial date range {startDate, endDate}
 */
const DateRangeFilter = ({ onDateRangeChange, initialRange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    initialRange?.startDate || getDefaultStartDate()
  );
  const [endDate, setEndDate] = useState(
    initialRange?.endDate || getDefaultEndDate()
  );
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset temp dates if cancelled
        setTempStartDate(startDate);
        setTempEndDate(endDate);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [startDate, endDate]);

  const formatDateRange = (start, end) => {
    // Parse dates as local time to avoid timezone issues
    const [startYear, startMonth, startDay] = start.split("-").map(Number);
    const [endYear, endMonth, endDay] = end.split("-").map(Number);
    const startDateObj = new Date(startYear, startMonth - 1, startDay);
    const endDateObj = new Date(endYear, endMonth - 1, endDay);

    const options = { month: "short", day: "numeric" };
    return `${startDateObj.toLocaleDateString(
      "en-US",
      options
    )} - ${endDateObj.toLocaleDateString("en-US", options)}`;
  };

  const handlePresetClick = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    const newStartDate = formatDateLocal(start);
    const newEndDate = formatDateLocal(end);

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setTempStartDate(newStartDate);
    setTempEndDate(newEndDate);
    onDateRangeChange({ startDate: newStartDate, endDate: newEndDate });
    setIsOpen(false);
  };

  const handleApply = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    onDateRangeChange({ startDate: tempStartDate, endDate: tempEndDate });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day),
      });
    }

    return days;
  };

  const handleDayClick = (date) => {
    const dateStr = formatDateLocal(date);

    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // Start new selection
      setTempStartDate(dateStr);
      setTempEndDate(null);
    } else {
      // Set end date
      if (new Date(dateStr) < new Date(tempStartDate)) {
        // If clicked date is before start, swap them
        setTempEndDate(tempStartDate);
        setTempStartDate(dateStr);
      } else {
        setTempEndDate(dateStr);
      }
    }
  };

  const isDateInRange = (date) => {
    if (!tempStartDate) return false;
    const dateStr = formatDateLocal(date);
    if (!tempEndDate) return dateStr === tempStartDate;
    return dateStr >= tempStartDate && dateStr <= tempEndDate;
  };

  const isDateStart = (date) => {
    if (!tempStartDate) return false;
    return formatDateLocal(date) === tempStartDate;
  };

  const isDateEnd = (date) => {
    if (!tempEndDate) return false;
    return formatDateLocal(date) === tempEndDate;
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const getDaysLabel = () => {
    // Always show the actual date range instead of labels
    return formatDateRange(startDate, endDate);
  };

  const calendarDays = generateCalendarDays();
  const monthYear = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 bg-white border-2 border-sky-200 text-gray-700 rounded-lg hover:border-sky-400 hover:shadow-md transition-all duration-200 shadow-sm font-medium"
      >
        <div className="flex items-center gap-2">
          <MdCalendarToday className="text-lg text-sky-600" />
          <span className="text-sm">{getDaysLabel()}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <MdKeyboardArrowDown className="text-xl text-sky-600" />
        </motion.div>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-3 left-0 bg-white rounded-xl shadow-2xl border-2 border-sky-100 z-50 w-[620px] overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-br from-white via-sky-50 to-white">
              {/* Quick Presets Section */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">
                  Quick Select
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handlePresetClick(0)}
                    className="px-3 py-2.5 text-xs font-semibold text-gray-700 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-lg hover:from-sky-200 hover:to-cyan-200 hover:text-sky-800 border border-sky-300 transition-all duration-200 hover:shadow-md"
                  >
                    Last day
                  </button>
                  <button
                    onClick={() => handlePresetClick(6)}
                    className="px-3 py-2.5 text-xs font-semibold text-gray-700 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-lg hover:from-sky-200 hover:to-cyan-200 hover:text-sky-800 border border-sky-300 transition-all duration-200 hover:shadow-md"
                  >
                    Last 7 days
                  </button>
                  <button
                    onClick={() => handlePresetClick(29)}
                    className="px-3 py-2.5 text-xs font-semibold text-gray-700 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-lg hover:from-sky-200 hover:to-cyan-200 hover:text-sky-800 border border-sky-300 transition-all duration-200 hover:shadow-md"
                  >
                    Last 30 days
                  </button>
                  <button
                    onClick={() => handlePresetClick(89)}
                    className="px-3 py-2.5 text-xs font-semibold text-gray-700 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-lg hover:from-sky-200 hover:to-cyan-200 hover:text-sky-800 border border-sky-300 transition-all duration-200 hover:shadow-md"
                  >
                    Last 90 days
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent mb-6"></div>

              {/* Date Inputs */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">
                  Custom Range
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      From
                    </label>
                    <input
                      type="date"
                      value={tempStartDate}
                      onChange={(e) => setTempStartDate(e.target.value)}
                      max={tempEndDate || formatDateLocal(new Date())}
                      className="w-full px-3 py-2.5 border-2 border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent bg-white hover:border-sky-300 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      To
                    </label>
                    <input
                      type="date"
                      value={tempEndDate || ""}
                      onChange={(e) => setTempEndDate(e.target.value)}
                      min={tempStartDate}
                      max={formatDateLocal(new Date())}
                      className="w-full px-3 py-2.5 border-2 border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent bg-white hover:border-sky-300 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Calendar Section */}
              <div className="mb-6 border-2 border-sky-200 rounded-xl p-5 bg-gradient-to-br from-sky-50 to-white">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-sky-200 rounded-lg transition-colors duration-200 text-sky-600 hover:text-sky-800"
                  >
                    <IoChevronBack className="text-lg" />
                  </button>
                  <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                    {monthYear}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-sky-200 rounded-lg transition-colors duration-200 text-sky-600 hover:text-sky-800"
                  >
                    <IoChevronForward className="text-lg" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-xs font-bold text-sky-700 text-center py-2 bg-sky-100 rounded-md"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((dayObj, index) => {
                    const isInRange = isDateInRange(dayObj.date);
                    const isStart = isDateStart(dayObj.date);
                    const isEnd = isDateEnd(dayObj.date);
                    const isToday =
                      formatDateLocal(dayObj.date) ===
                      formatDateLocal(new Date());

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          dayObj.isCurrentMonth && handleDayClick(dayObj.date)
                        }
                        disabled={!dayObj.isCurrentMonth}
                        className={`
                          relative py-2.5 text-sm rounded-lg font-medium transition-all duration-150
                          ${
                            !dayObj.isCurrentMonth
                              ? "text-gray-300 cursor-default"
                              : "text-gray-700 hover:bg-sky-100 cursor-pointer"
                          }
                          ${
                            isInRange && !isStart && !isEnd
                              ? "bg-sky-200 text-sky-900 font-semibold"
                              : ""
                          }
                          ${
                            isStart || isEnd
                              ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold hover:from-sky-700 hover:to-cyan-700 shadow-lg"
                              : ""
                          }
                          ${
                            isToday && !isInRange
                              ? "border-2 border-sky-500"
                              : ""
                          }
                        `}
                      >
                        {dayObj.day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 border border-gray-300 hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={!tempStartDate || !tempEndDate}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 rounded-lg hover:from-sky-700 hover:to-cyan-700 active:from-sky-800 active:to-cyan-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangeFilter;
