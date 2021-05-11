const axios = require("axios");
var aws = require("aws-sdk");
var docClient = new aws.DynamoDB.DocumentClient();
var ses = new aws.SES({ region: "ap-south-1" });

let district = process.env.DISTRICT;
let districtName = process.env.DISTRICT_NAME;
let tableName = process.env.TABLE_NAME;
let coolOffTable = process.env.COOLOFF;
let token = process.env.TOKEN;
let cooloffHrs = 1;
let telegramToken = process.env.TELEGRAMTOKEN;
let telegramChat = process.env.TELEGRAMCHAT;
let telegramChat45 = process.env.TELEGRMCHAT45;
let sendEmail = process.env.EMAIL;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

exports.main = function (event, context) {
  //wait random amount of time from 1 ms to 10 sec
  //var sleeptime = Math.floor(Math.random() * 1000) + 1;
  //sleep(sleeptime)


  var noresponse = true;
  //while(noresponse){
  // Default options are marked with *
  var today = new Date();
  var dd = today.getDate();
  let data;
  var vaccineAvailabilityEmailMessage = [];
  var vaccineAvailabilityEmailMessage45 = [];
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }
  today = dd + "-" + mm + "-" + yyyy;
  console.log("Date to be used in request - > ", today);
  const options = {
    referrer: "https://selfregistration.cowin.gov.in/",
    referrerPolicy: "strict-origin-when-cross-origin",
    method: "GET",
    mode: "cors", 
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      authorization: "Bearer " + token,
      "sec-ch-ua":
        '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.51"
    }
  };
  axios
    .get(
      "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=" +
        district +
        "&date=" +
        today,
      options
    )
    .then(function (response) {
      // handle success
      //console.log('Succesful response ',JSON.stringify(response.data))
      data = response.data;
      data.centers.forEach((center) => {
        noresponse = false;
        var centerName = center.name;
        center.sessions.forEach((session) => {
          var date = session.date;
          var minage = session.min_age_limit;
          var capacity = session.available_capacity;
          var vaccine = session.vaccine;
          if (capacity > 10 && minage < 44) {
            var emailmessage =
              "*** " +
              capacity +
              " " +
              vaccine +
              " " +
              " vaccine(s) available in center :" +
              centerName +
              " on " +
              date +
              " \n";
            vaccineAvailabilityEmailMessage.push(emailmessage);
          } else if (capacity > 10 && minage > 44) {
            var message =
              "*** " +
              capacity +
              " " +
              vaccine +
              " " +
              " vaccine(s) available in center :" +
              centerName +
              " on " +
              date +
              " \n";
            vaccineAvailabilityEmailMessage45.push(message);
          } else {
            var message =
              "Capacity for age " +
              minage +
              " in centerName " +
              centerName +
              " on " +
              date +
              " @District : " +
              districtName +
              " is " +
              capacity;
            console.log(message);
          }
        });
      });
      // send one email per district
      console.log(
        "Email Message will be send -> ",
        vaccineAvailabilityEmailMessage
      );
      console.log(
        "Email Message will be send -> ",
        vaccineAvailabilityEmailMessage45
      );
      if (
        vaccineAvailabilityEmailMessage45.length > 0 &&
        telegramChat45 != "-1"
      ) {
        axios
          .get(
            "https://api.telegram.org/bot" +
              telegramToken +
              "/sendMessage?chat_id=" +
              telegramChat45 +
              "&text=Alert for " +
              districtName +
              " : Vaccine available for (45 and Above) age group \n" +
              vaccineAvailabilityEmailMessage45
          )
          .then(function (response) {
            console.log("Message Send to telegram");
          });
      }

      if (vaccineAvailabilityEmailMessage.length > 0) {
        //Send email only if there is no cooloff

        axios
          .get(
            "https://api.telegram.org/bot" +
              telegramToken +
              "/sendMessage?chat_id=" +
              telegramChat +
              "&text=Alert for " +
              districtName +
              " : Vaccine available for (18-44) age group \n" +
              vaccineAvailabilityEmailMessage
          )
          .then(function (response) {
            console.log("Message Send to telegram");
          });
      }
    })
    .catch(function (error) {
      console.log("Error in calling API --> ", error);
    })
    .then(function () {
      // always executed
    });
};
