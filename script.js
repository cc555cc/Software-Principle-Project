//const { del } = require("express/lib/application");

let date = 0;
let month = 0;
let year = 0;
//variables for displaying the current date//

let hasEventColor = "yellow";
let selectedDateColor = "lightgreen";
let currentCell = "";

let currentDate = 0;

//colors//
let captionColor = "Red";
let weekDayColor = "orange";
let backgroundColor = "lightgrey";
let dateDetailAreaColor = "white";

let colorArray = [
  captionColor,
  weekDayColor,
  backgroundColor,
  dateDetailAreaColor,
  hasEventColor,
  selectedDateColor,
];

//2D array for displaying the days in the page//
let calendar = [
  [" ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " "],
];

//make a new date object and get the month and year seperately//
function getCurrentDate() {
  date = new Date();
  month = date.getMonth();
  year = date.getFullYear();
}

//fill the 2D array with updated date based on the month and year input//
function constructCalendar(month, year) {
  const firstDate = new Date(year, month, 1); //a new date object//
  const firstDay = firstDate.getDay(); //what day does the month starts on//
  const maxDay = getMaxDay(month); //what is the maximum amount of day in that month//

  let dayCount = 1; //first day always start with "1"//
  for (let week = 0; week < 6; week++) {
    //loop through week(row) & days(row's cell)//
    for (let day = 0; day < 7; day++) {
      if (week == 0 && day < firstDay) {
        //if it is still looping the first week and haven't reach the starting day//
        calendar[week][day] = " "; //consider the case that a already filled calendar will apply this//
        continue;
      } else if (dayCount > maxDay) {
        //dayCount reaches the max day in the month but hasn't reach the last cell of the calendar//
        calendar[week][day] = " ";
      } else {
        calendar[week][day] = dayCount;
        dayCount++;
      }
    }
  }

  //extra row for the 6 weeks month//
  const extraWeekCell = document.querySelectorAll(".dateExtraWeek");
  for (let cell of extraWeekCell) {
    if (calendar[5][0] !== " ") {
      cell.style.display = "";
    } else {
      cell.style.display = "none";
    }
  }

  const paragraph = document.createElement("p");
  paragraph.id = "day-cell-id-storage";
  paragraph.value = "";
  paragraph.style.display = "none";
  document.getElementById("calendar").appendChild(paragraph);
}

//create the "day" cell for the calendar//
function printCalendar(month, year) {
  document.getElementById("month").textContent = monthToText(month); //set the month to corresponding word//
  document.getElementById("year").textContent = year; //display year on calendar//
  for (let week = 0; week < 6; week++) {
    //lop through the 2D array//
    document.write("<tr>"); // start a row//
    for (let day = 0; day < 7; day++) {
      if (week <= 4) {
        //add table cell for each value in that row, also added id for identification//
        document.write(
          '<td id="' + week + day +
            '" class="date" data-value="' +
            calendar[week][day] +
            '">' +
            calendar[week][day] + 
            "</td>"
        );
      } else if (week > 4) { //when the month has more than 4 weeks, it is consider an extra week//
        document.write(
          '<td id="' +week + day +
            '" class="dateExtraWeek" data-value="' + //use extra week's day cell instead//
            calendar[week][day] +
            '" style="display:none ">' +
            calendar[week][day] +
            "</td>"
        );
      }
      if(day == 0){
        let cellId = `${week}${day}`;
          document.getElementById(cellId).style.color = 'red';
      }
    }
    document.write("</tr>"); //end the row//
  }
  const cells = document.querySelectorAll(".date"); //get every "day" cell//
  const cells2 = document.querySelectorAll(".dateExtraWeek"); //get every "day" cell//
  for (let cell of cells) {
    cell.addEventListener("click", function () {
      addDayDetail(this.id);
    }); //give them an event listener//
  }
  for (let cell of cells2) {
    cell.addEventListener("click", function () {
      addDayDetail(this.id);
    });
  }

  //hide extra week day cell initially//
  if(calendar[5][0] != ""){
    const extraWeekCell = document.querySelectorAll(".dateExtraWeek");
    for (let cell of extraWeekCell) {
        cell.style.display = "";
    }
  }
}

//after the constructCalendar(), reassign each "day" cell with the updated text content//
function rewriteCalendar(month) {
  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 7; day++) {
      let cellId = `${week}${day}`; //get the id of each "day" cell//
      let tableCell = document.getElementById(cellId);
      if (tableCell) {
        tableCell.textContent = calendar[week][day];
      }
    }
  }
}

//function get the maximum amount of day in that month//
function getMaxDay(month) {
  let days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days_in_month[month];
}

//function use by left arrow image button on click//
function previousMonth() {
  deleteHighLight();
  if (month == 0) {
    //if current month is January//
    year--;
    month = 11; //jump to previous year's December//
  } else {
    month--; //previous month//
  }
  document.getElementById("month").textContent = monthToText(month); //update "month" text on calendar//
  document.getElementById("year").textContent = year; //update "year" text on calendar//
  constructCalendar(month, year); //update the value in the 2D array//
  rewriteCalendar(month); //update the value in actual table cell//
  hasEvent();
}

//function use by right arrow image button on click, works pretty much the same as the one above//
function nextMonth() {
  deleteHighLight(); //remove all highlight//
  if (month == 11) {
    year++;
    month = 0;
  } else {
    month++;
  }
  document.getElementById("month").textContent = monthToText(month); //update month display//
  document.getElementById("year").textContent = year; //update year display//
  constructCalendar(month, year); //rewrite the calendar matrix//
  rewriteCalendar(month); //re-popularize the calender//
  hasEvent(); //check for event//
}

//function to convert the month value to corresponding word//
function monthToText(month) {
  let months = ["January","February","March","April","May","June","July","August","September","October","November","December",];
  return months[month];
}

//update current date upon clciking on a day cell//
function addDayDetail(cellId) {
  if (document.getElementById("day-cell-id-storage").value != "") { //not a valid day in the month//
    document.getElementById(
      document.getElementById("day-cell-id-storage").value
    ).style.backgroundColor = "white";
    hasEvent();
  }

  document.getElementById("day-cell-id-storage").value = cellId;
  document.getElementById(cellId).style.backgroundColor = selectedDateColor;
  currentDate =  document.getElementById(cellId).textContent; //update the global variable of the currently selected date//
  currentCell = cellId; //and that cell's id upon clicking on it//
 
  //document.getElementById("day-cell-id-storage").value = cellId;
  retrieveEvents(document.getElementById(cellId).textContent); 
  //also get the events array list from local storage//

}

//create or retrieve a events array list that store event object, push one event object and return that array//
function createEvent(event) {
  event.preventDefault(); //not using submit's default action//

  //get the input from user in the form//
  const eventName = document.getElementById("eventName").value;
  const eventDescription = document.getElementById("eventDescription").value;
  const st = document.getElementById("event-start-time").value;
  const et = document.getElementById("event-end-time").value;

  //create a new event object//
  const uniqueID = crypto.randomUUID();
  const newEvent = {
    name: eventName,
    startTime: st,
    endTime: et,
    description: eventDescription,
    eventYear: year, //add time specification for categoriation later when object is retrieved//
    eventMonth: month,
    eventDay: document.getElementById(currentCell).textContent,
    cellId: document.getElementById(currentCell).id,
    uniqueId: uniqueID,
  };

  //check if events already exist in local data//
  if (localStorage.getItem("events")) {
    events = JSON.parse(localStorage.getItem("events")); //rewrite events as the events that is stored in the local storage//
  } else {
    events = [];
  }

  //input validation//
  if (currentDate.trim() == "") {
    alert("**please select a valid date**");
  } else if (document.getElementById("eventName").value == "") {
    alert("**please enter a name for the booking**");
  } else if(et < st){
    alert("**time is invalid**");
  }else {
    events.push(newEvent); //put the new event object to the events array list//
    localStorage.setItem("events", JSON.stringify(events)); //put events array list back to local storage//
    retrieveEvents();
    printAllEvent();
    alert("Event saved successfully!");
  }
  hasEvent();
}

//retrieve events list from local memory and insert values into "eventObj" and display//
function retrieveEvents(){
  let eventList = localStorage.getItem("events");
  if(eventList){
    let storedEvent = JSON.parse(eventList); //turns the list to JS object//
    const checkEventDiv = document.getElementById("checkEvent"); //represent the display divison//
    checkEventDiv.innerHTML = "";

    for(let event of storedEvent){
      if(year == event.eventYear && month == event.eventMonth &&
         document.getElementById(currentCell).textContent == event.eventDay  //check mif year, month and day match the selected event//
      ){
         //generate a new "eventObj" for containing the detail of the event//
         let eventObj = document.createElement("div");
         eventObj.id = event.uniqueId;
         eventObj.style.border = "2px solid black";

         let content = [ ["event-name-java","Name: " + event.name, event.name],
                         ["event-time-java-day", "Time: " + event.startTime + " - " + event.endTime, event.startTime],
                         ["event-description-java-day","Description: " + event.description, event.description]
                       ];
        
        //insert content into the eventObj//
        for(let i = 0; i < 3; i++){
          let p = document.createElement("p");
          p.id = content[i][0];
          p.textContent = content[i][1];
          p.value = content[i][2];
          p.style.paddingLeft = "10px";
          eventObj.appendChild(p);
        }

        //creates button//
        const buttonDiv = document.createElement("div");
        buttonDiv.style.padding = "10px";
        buttonDiv.id = "buttonDiv";

        content = [ ["editButton","Edit"],
                    ["deleteButton","Delete"]
                  ];
        
        //generate edit and delete button//
        for(let i = 0; i < 2; i++){
          let button = document.createElement("button");
          button.class = content[i][0];
          button.textContent = content[i][1];
          button.style.marginRight = "10px";
          if(i == 0){
            button.addEventListener("click", function(){
              editEvent(eventObj,event,button);
              this.style.display = "none";
            });
          }else{
            button.addEventListener("click", function(){
              deleteEvent(event.uniqueId);
            });
          }
          buttonDiv.appendChild(button);
        }
        eventObj.appendChild(buttonDiv);
        checkEventDiv.appendChild(eventObj);
      }
    }
  }
}

//remove event from local cache//
function deleteEvent(key) {
  if (confirm("Are you sure you want to delete this event")) {
    //take events out from local storage and make it a JSON object//
    let events = JSON.parse(localStorage.getItem("events")) || [];
    let index = events.findIndex((event) => event.uniqueId === key); //find the index of the event given the key//
    if (index !== -1) {
      events.splice(index, 1);
      localStorage.setItem("events", JSON.stringify(events));

      //update display//
      rewriteCalendar();
      hasEvent();
      retrieveEvents();
      printAllEvent();
    } else {
      alert("not found");
    }
  }
  hasEvent();
}

function editEvent(eventObj, storedEvent, editButton){
  //declare old contents from the eventObj//
  let oldName = storedEvent.name;
  let oldTimeS = storedEvent.startTime;
  let oldTimeE = storedEvent.endTime;
  let oldDes = storedEvent.description;

  //create input fields//
  const editName = document.createElement("input");
  editName.type = "text";
  editName.required = true;
  editName.value = oldName;
  editName.required = true;

  const editDescription = document.createElement("textarea");
  editDescription.style.width =  "20vh";
  editDescription.style.resize = "none";
  editDescription.oninput= function(){
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  };
  editDescription.value = oldDes;
  editDescription.required = true;

  const editTimeS = document.createElement("input");
  editTimeS.type = "time";
  editTimeS.id = "event-start-time";
  editTimeS.value = oldTimeS;
  editTimeS.required = true;

  const editTimeE = document.createElement("input");
  editTimeE.type = "time";
  editTimeE.id = "event-end-time";
  editTimeE.value = oldTimeE;
  editTimeE.required = true;

  const timeEditDiv = document.createElement("div");
  const h = document.createElement("span");
  h.textContent = " - ";
  timeEditDiv.appendChild(editTimeS);
  timeEditDiv.appendChild(h);
  timeEditDiv.appendChild(editTimeE);

  //replace the original text with input fields with old values//
  let nameDisplay = eventObj.querySelector("#event-name-java");
  let timeDisplay = eventObj.querySelector("#event-time-java-day");
  let desDisplay = eventObj.querySelector("#event-description-java-day");
  let buttons = eventObj.querySelector("#buttonDiv");
  nameDisplay.textContent = "Name: ";
  nameDisplay.appendChild(editName);

  timeDisplay.textContent = "Time: ";
  timeDisplay.appendChild(timeEditDiv);

  desDisplay.textContent = "Description: ";
  desDisplay.appendChild(editDescription);

  //backButton//
  const backButton = document.createElement("button");
  backButton.class = "backButton";
  backButton.textContent = "Back";
  backButton.style.padding = "10px;";
  backButton.style.marginRight = "10px";
  backButton.addEventListener("click", function () {
    //remove the input elements and restore the old value//
    nameDisplay.innerHTML = "";
    nameDisplay.textContent = "Name: " + oldName;

    timeDisplay.innerHTML = "";
    timeDisplay.textContent = "Time: " + oldTimeS + " - " + oldTimeE;

    desDisplay.innerHTML = "";
    desDisplay.textContent = "Description: " + oldDes;

    saveButton.remove();
    editButton.style.display = "inline-block";
    this.remove();
  });
  buttons.appendChild(backButton);

  //saveButton//
  let saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.style.marginRight = "10px";
  saveButton.addEventListener("click", function(){
  //input validation//
    if(editName.value==""){ //no booking name entered//
      alert("**the booking must have a name**");
    }else if(editTimeE.value == "" || editTimeS == ""){ //no starting time or ending time entered//
      alert("**the booking must have a starting/ending time**");
    }else if(editTimeE.value < editTimeS.value){ //ending time is earlier than starting time//
      alert("**time is invalid**");
    }else{
      //remove input fields and update text content//
      nameDisplay.innerHTML = "";
      nameDisplay.textContent = "Name: " + editName.value;

      timeDisplay.innerHTML = "";
      timeDisplay.textContent = "Time: " + editTimeS.value + " - " + editTimeE.value;

      desDisplay.innerHTML = "";
      desDisplay.textContent = "Description: " + editDescription.value;
      //retrieve "events"//
      let events = JSON.parse(localStorage.getItem("events")) || [];
      let index = events.findIndex((event) => event.uniqueId === storedEvent.uniqueId);
      if(index !== -1){ //update event object's data//
        events[index].name = editName.value;
        events[index].startTime = editTimeS.value;
        events[index].endTime = editTimeE.value;
        events[index].description = editDescription.value;
        localStorage.setItem("events", JSON.stringify(events));//and send it back to local storage//
      }
      //refresh both the events of day and event overview section//
      printAllEvent();
      editButton.style.display = "inline-block";
      backButton.remove();
      this.remove();
      document.getElementById("checkEvent").innerHTML = "";
      retrieveEvents();
    }
  });
  buttons.appendChild(saveButton);
}

//check if a day cell has event on that day//
function hasEvent() {
  //retrieve the events array list from the local storage//
  if (localStorage.getItem("events")) {
    const storedEvent = JSON.parse(localStorage.getItem("events"));
    for (let event of storedEvent) {
      if (month == event.eventMonth && year === event.eventYear) { //has event//
        document.getElementById(event.cellId).style.backgroundColor =
          hasEventColor; //special marking//
      }else{ //no event//
        document.getElementById(event.cellId).style.backgroundColor =
          "white";
      }
    }
  }
}

//remove hasEvent highlight//
function deleteHighLight() {
  //retrieve the events array list from the local storage//
  if (localStorage.getItem("events")) {
    const storedEvent = JSON.parse(localStorage.getItem("events"));
    for (let event of storedEvent) {
      //alert(year +"," + event.eventYear);
      if (month == event.eventMonth && year === event.eventYear) {
        document.getElementById(event.cellId).style.backgroundColor = "white";
      }
    }
  }
}

//print all event to event overview//
function printAllEvent() {
  //make sure custoomize section is closed//
  let eventDiv = document.getElementById("navDisplay");
  document.getElementById("customizePanel").style.display = "none";
  //let addDiv = document.getElementById("addEvent");
  eventDiv.style.display = "block";

  //print all event as "eventObj"//
  if (localStorage.getItem("events")) {
    //make sure events exist in local storage//
    const storedEvent = JSON.parse(localStorage.getItem("events"));
    const overview = document.getElementById("event-overview");
    navDisplay.innerHTML = ""; //clear that division first//

    //loop through each event in the array//
    const dateOfEventDiv = document.createElement("div");
    dateOfEventDiv.id = "date-of-event-div";

    for (let event of storedEvent) {
      let content =[ event.eventYear + "/", event.eventMonth + 1 + "/",event.eventDay];
      
      for(let i = 0 ; i < 3; i++){
        const dateElement = document.createElement("p"); 
        dateElement.id = "event-overview-date";
        dateElement.textContnt = content[i];
        dateElement.style.display = "inline";
        dateOfEventDiv.appendChild(dateElement);
      }

      //put the date info inside a divison and add that division into the overview section//
      content = [ ["event-overview-name","name: " + event.name ],
                  ["event-overview-time","Time: " + event.startTime + " - " + event.endTime],
                  ["event-overview-description","Description: " + event.description]
                ];

      for(let i = 0; i < 3;i++){
        const eventInfo = document.createElement("p");
        eventInfo.id = content[i][0];
        eventInfo.textContent = content[i][1];
        eventDiv.appendChild(eventInfo);
      }
    }
  }
}

//make color pickers visible and hide event overview//
function customizePanel() {
  let cp = document.getElementById("customizePanel");
  let ev = document.getElementById("navDisplay");
  if (cp.style.display == "none") {
    cp.style.display = "block";
    ev.style.display = "none";
  }
}

//create color pickers//
function makeColorPanel() {
  let cp = document.getElementById("customizePanel");

  //color pickers for header, weekday, background and date detail area//
  let item = [
    ["Calendar Header Color:", "table caption"],
    ["Weekdays Row Color:", "#day"],
    ["Background Color:", "body"],
    ["Date's Detail Area:", "#addEvent", "#checkEvent"],
    ["Event Highlight Color:"],
    ["Selected Date Color:"]
  ];

  for (let i = 0; i < item.length; i++) {
    let name = item[i][0];
    let searchKey = item[i][1];

    const colorPanel = document.createElement("div");
    colorPanel.style.display = "flex";
    colorPanel.style.alignItems = "center";

    const title = document.createElement("p");
    title.textContent = name;
    title.id = "colorControlItem";
    title.style.padding = "10px";
    colorPanel.appendChild(title);

    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.class = "colorPicker";
    for (let j = 1; j < item[i].length; j++) {
      if(i < 4){
        colorPicker.addEventListener("input", function () {
          const targets = document.querySelectorAll(item[i][j]);
            targets.forEach((target) => {
            target.style.backgroundColor = this.value;
          saveNewColor(i, this.value);
        });
      });
      }
    }
    if(i == 4){
      colorPicker.addEventListener("input", function () {
        saveNewColor(4, this.value);
        hasEventColor = this.value;
        hasEvent();
      });
    }else if(i == 5){
        colorPicker.addEventListener("input", function () {
        selectedDateColor = this.value;
        addDayDetail(currentCell);
        saveNewColor(5, this.value);
      });
    }
    colorPanel.appendChild(colorPicker);
    cp.appendChild(colorPanel);
  }
}

//jump to a specific month in a specific year according to the date picker//
function getDate() {
  //date picker's value//
  let selectedDate = new Date(document.getElementById("datepicker").value);
  month = selectedDate.getMonth();
  year = selectedDate.getFullYear();
  
  if(!isNaN(month)|| !isNaN(year)){//input validation//
    document.getElementById("month").textContent = monthToText(month); //update "month" text on calendar//
    document.getElementById("year").textContent = year; //update "year" text on calendar//
    constructCalendar(month, year); //update the value in the 2D array//
    rewriteCalendar(month); //update the value in actual table cell//
    hasEvent();
  }
}

function navControl() {
  document.getElementById("mySidenav").style.width == "0px"
    ? openNav()
    : closeNav();
}

//make navigation bar visible//
function openNav() {
  document.getElementById("mySidenav").style.width = "400px";
}

// Close the side navigation
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

//retrieve elementColors JSON object//
function retrieveColor() {
  let savedColor = localStorage.getItem("elementColors");
  if (!savedColor) {
    localStorage.setItem("elementColors", JSON.stringify(colorArray)); //create one if not//
  } else {
    colorArray = JSON.parse(savedColor); //update the color array with stored color//
  }
}

//overwrite elementColors JSON object after the a change in color panel's value//
function saveNewColor(index, color) {
  colorArray[index] = color;
  localStorage.setItem("elementColors", JSON.stringify(colorArray));
}

//set color after all DOM element is loaded//
function DOMloadColor() {
  const savedColor = JSON.parse(localStorage.getItem("elementColors"));

  let item = ["table caption", "#day", "body", "#addEvent", "#checkEvent"];

  for (let i = 0; i < item.length; i++) {
    let targets = document.querySelectorAll(item[i]);
    console.log(targets);
    targets.forEach((target) => {
      if (i < 4) {
        target.style.backgroundColor = savedColor[i];
      } else {
        target.style.backgroundColor = savedColor[i - 1];
      }
    });
  }

  hasEventColor = savedColor[4];
  hasEvent();
  selectedDateColor = savedColor[5];
}

function createEventTest(){
}


getCurrentDate();
constructCalendar(month, year);
printCalendar(month, year);
hasEvent();
makeColorPanel();
retrieveColor();
