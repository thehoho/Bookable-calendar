// Function to check if a year is a leap year
const isLeapYear = (year) => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};

// Function to get the number of days in February for a given year
const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

// Initialize the calendar elements
let calendar = document.querySelector(".calendar");
const month_names = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month_picker = document.querySelector("#month-picker");
const dayTextFormate = document.querySelector(".day-text-formate");
const timeFormate = document.querySelector(".time-formate");
const dateFormate = document.querySelector(".date-formate");

month_picker.onclick = () => {
  month_list.classList.remove("hideonce");
  month_list.classList.remove("hide");
  month_list.classList.add("show");
  dayTextFormate.classList.remove("showtime");
  dayTextFormate.classList.add("hidetime");
  timeFormate.classList.remove("showtime");
  timeFormate.classList.add("hideTime");
  dateFormate.classList.remove("showtime");
  dateFormate.classList.add("hideTime");
};

// Define an array to store selected dates
let selectedDates = JSON.parse(localStorage.getItem("selectedDates")) || [];

// Define start and end dates for range selection
let startDate = null;
let endDate = null;

// Function to render the selected dates
function renderSelectedDates() {
  const selectedDatesList = document.getElementById("selected-dates-list");
  selectedDatesList.innerHTML = "";

  selectedDates.forEach((date, index) => {
    const li = document.createElement("li");
    li.textContent = date;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      selectedDates.splice(index, 1);
      saveSelectedDates();
      renderSelectedDates();
      // Remove the selected class from the calendar
      const dateParts = date.split(" ");
      const day = dateParts[2];
      const month = month_names.indexOf(dateParts[1]);
      const year = dateParts[3];
      const dayElement = document.querySelector(
        `.calendar-days div[data-date='${year}-${month}-${day}']`
      );
      if (dayElement) {
        dayElement.classList.remove("selected", "in-range");
      }
    });

    li.appendChild(deleteButton);
    selectedDatesList.appendChild(li);
  });
}

function saveSelectedDates() {
  localStorage.setItem("selectedDates", JSON.stringify(selectedDates));
}

// Function to generate the calendar for a given month and year
const generateCalendar = (month, year) => {
  let calendar_days = document.querySelector(".calendar-days");
  calendar_days.innerHTML = "";
  let calendar_header_year = document.querySelector("#year");
  let days_of_month = [
    31,
    getFebDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let currentDate = new Date();

  month_picker.innerHTML = month_names[month];
  calendar_header_year.innerHTML = year;

  let first_day = new Date(year, month);

  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
    let day = document.createElement("div");

    if (i >= first_day.getDay()) {
      day.innerHTML = i - first_day.getDay() + 1;
      day.setAttribute("data-date", `${year}-${month}-${day.innerHTML}`);

      const dateValue = new Date(year, month, day.innerHTML);
      if (dateValue < currentDate.setHours(0, 0, 0, 0)) {
        day.classList.add("disabled-date");
      } else {
        day.addEventListener("click", () => {
          const selectedDate = new Date(year, month, parseInt(day.innerHTML));

          if (!startDate || (startDate && endDate)) {
            startDate = selectedDate;
            endDate = null;
            selectedDates = [startDate.toDateString()];
            saveSelectedDates();
            document.querySelectorAll(".calendar-days div").forEach((day) => {
              day.classList.remove("selected", "in-range");
            });
            day.classList.add("selected");
          } else {
            if (
              selectedDate < startDate ||
              selectedDate.getMonth() !== startDate.getMonth()
            ) {
              startDate = selectedDate;
              endDate = null;
              selectedDates = [startDate.toDateString()];
              saveSelectedDates();
              document.querySelectorAll(".calendar-days div").forEach((day) => {
                day.classList.remove("selected", "in-range");
              });
              day.classList.add("selected");
            } else {
              endDate = selectedDate;
              selectedDates = [];
              for (
                let date = new Date(startDate);
                date <= endDate;
                date.setDate(date.getDate() + 1)
              ) {
                selectedDates.push(new Date(date).toDateString());
              }
              saveSelectedDates();
              renderSelectedDates();
              document.querySelectorAll(".calendar-days div").forEach((day) => {
                const dayDate = new Date(year, month, parseInt(day.innerHTML));
                if (isInRange(dayDate, startDate, endDate)) {
                  day.classList.add("in-range");
                }
                if (
                  dayDate.getTime() === startDate.getTime() ||
                  dayDate.getTime() === endDate.getTime()
                ) {
                  day.classList.add("selected");
                }
              });
            }
          }
        });
      }

      // Check if the date is already selected
      if (
        selectedDates.includes(
          new Date(year, month, day.innerHTML).toDateString()
        )
      ) {
        day.classList.add("selected");
      }
    }
    calendar_days.appendChild(day);
  }
};

const isInRange = (date, start, end) => {
  return date >= start && date <= end;
};

let month_list = calendar.querySelector(".month-list");
month_names.forEach((e, index) => {
  let month = document.createElement("div");
  month.innerHTML = `<div>${e}</div>`;

  month_list.append(month);
  month.onclick = () => {
    currentMonth.value = index;
    generateCalendar(currentMonth.value, currentYear.value);
    month_list.classList.replace("show", "hide");
    dayTextFormate.classList.remove("hideTime");
    dayTextFormate.classList.add("showtime");
    timeFormate.classList.remove("hideTime");
    timeFormate.classList.add("showtime");
    dateFormate.classList.remove("hideTime");
    dateFormate.classList.add("showtime");
  };
});

(function () {
  month_list.classList.add("hideonce");
})();

document.querySelector("#pre-year").onclick = () => {
  --currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};

document.querySelector("#next-year").onclick = () => {
  ++currentYear.value;
  generateCalendar(currentMonth.value, currentYear.value);
};

let currentDate = new Date();
let currentMonth = { value: currentDate.getMonth() };
let currentYear = { value: currentDate.getFullYear() };
generateCalendar(currentMonth.value, currentYear.value);

const todayShowTime = document.querySelector(".time-formate");
const todayShowDate = document.querySelector(".date-formate");

const currshowDate = new Date();
const showCurrentDateOption = {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
};
const currentDateFormate = new Intl.DateTimeFormat(
  "en-US",
  showCurrentDateOption
).format(currshowDate);
todayShowDate.textContent = currentDateFormate;

setInterval(() => {
  const timer = new Date();
  const option = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const formateTimer = new Intl.DateTimeFormat("en-us", option).format(timer);
  let time = `${`${timer.getHours()}`.padStart(
    2,
    "0"
  )}:${`${timer.getMinutes()}`.padStart(
    2,
    "0"
  )}: ${`${timer.getSeconds()}`.padStart(2, "0")}`;
  todayShowTime.textContent = formateTimer;
}, 1000);

window.onload = () => {
  renderSelectedDates();
  if (selectedDates.length > 0) {
    const startDateStr = selectedDates[0];
    const startDateParts = startDateStr.split(" ");
    startDate = new Date(
      startDateParts[3],
      month_names.indexOf(startDateParts[1]),
      parseInt(startDateParts[2])
    );

    if (selectedDates.length > 1) {
      const endDateStr = selectedDates[selectedDates.length - 1];
      const endDateParts = endDateStr.split(" ");
      endDate = new Date(
        endDateParts[3],
        month_names.indexOf(endDateParts[1]),
        parseInt(endDateParts[2])
      );
    }
  }
};
