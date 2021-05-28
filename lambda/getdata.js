const axios = require("axios");
var aws = require("aws-sdk");
var crypto = require("crypto");

let district = process.env.DISTRICT;
let districtName = process.env.DISTRICT_NAME;
let token = process.env.TOKEN;
let telegramToken = process.env.TELEGRAMTOKEN;
let telegramChat = process.env.TELEGRAMCHAT;
let telegramChat45 = process.env.TELEGRMCHAT45;
let dynamodbTable = process.env.COOLOFFTABLE;
let cooloffHrs = 24;

var docClient = new aws.DynamoDB.DocumentClient();

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || "md5")
    .update(str, "utf8")
    .digest(encoding || "hex");
}

function storeChecksumSendNotification(
  checksum,
  vaccineAvailabilityEmailMessage,
  ageGroup,
  tcID
) {
  var expiryTime = new Date();
  expiryTime.setHours(new Date().getHours() + cooloffHrs);

  var params = {
    TableName: dynamodbTable,
    Item: {
      id: district + telegramToken + ageGroup,
      checksum: checksum,
      timetolive: expiryTime.getTime(),
    },
  };
  docClient.put(params, function (err, insertdata) {
    if (err) {
      console.error(
        "Unable to add item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("Added item:", JSON.stringify(insertdata));
      //sending notification
      var telegrammessage = "Alert for " +
      districtName +
      " : Vaccine available for (" +
      ageGroup +
      ") age group \n" +
      vaccineAvailabilityEmailMessage;

      console.log('Sending Telegram message -> ',telegrammessage)

      axios
        .post("https://api.telegram.org/bot" + telegramToken + "/sendMessage", {
          chat_id: tcID,
          text: telegrammessage
        })
        .then(function (response) {
          console.log("Message Send to telegram->",response);
        });
    }
  });
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
  var vaccineNonAvailability = [];
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
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.51",
    },
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
        var centerAddress = center.address;
        var pincode = center.pincode;
        var block = center.block_name;
        var feeType = center.fee_type;
        var vaccine_fees = center.vaccine_fees;
        var fee = '0'
        if(vaccine_fees){
          fee = vaccine_fees[0].fee
        }
        
        center.sessions.forEach((session) => {
          var date = session.date;
          var minage = session.min_age_limit;
          var capacity = session.available_capacity;
          var dose1 = session.available_capacity_dose1;
          var dose2 = session.available_capacity_dose2;
          var vaccine = session.vaccine;
          

          if (capacity > 10 && minage < 44) {
            var emailmessage =
              "*** " +
              capacity +
              " " +
              vaccine +
              " (Dose 1 : " +
              dose1 +
              " , Dose 2 : " +
              dose2 +
              ") " +
              " vaccine(s) available in center :" +
              centerName +
              " \nAddress : " +
              centerAddress +
              " \nPincode : " +
              pincode +
              " \nBlock : " +
              block +
              " \nFee Type : " +
              feeType + "(Rs."+fee+")"+
              "  \nDate : " +
              date +
              " \n";
            vaccineAvailabilityEmailMessage.push(emailmessage);
          } else if (capacity > 10 && minage > 44) {
            var message =
              "*** " +
              capacity +
              " " +
              vaccine +
              " (Dose 1 : " +
              dose1 +
              " , Dose 2 : " +
              dose2 +
              ") " +
              " vaccine(s) available in center :" +
              centerName +
              " \nAddress : " +
              centerAddress +
              " \nPincode : " +
              pincode +
              " \nBlock : " +
              block +
              " \nFee Type : " +
              feeType + "(Rs."+fee+")"+
              "  \nDate : " +
              date +
              " \n";
            vaccineAvailabilityEmailMessage45.push(message);
          } else {
            var message =
              "*** " +
              capacity +
              " " +
              vaccine +
              " (Dose 1 : " +
              dose1 +
              " , Dose 2 : " +
              dose2 +
              ") " +
              " vaccine(s) available in center :" +
              centerName +
              " \nAddress : " +
              centerAddress +
              " \nPincode : " +
              pincode +
              " \nBlock : " +
              block +
              " \nFee Type : " +
              feeType + "(Rs."+fee+")"+
              " \nDate : " +
              date +
              " \n";
            //console.log(message);
            vaccineNonAvailability.push(message)
          }
        });
      });
      console.log('Non Available vaccine -> ',vaccineNonAvailability)
      console.log('18+ vaccine -> ',vaccineAvailabilityEmailMessage)
      console.log('45+ vaccine -> ',vaccineAvailabilityEmailMessage45)
      //Calculate the checksum for the messages (45 and 18 both)
      //compare it with dynamodb checksum (if exists)
      //if same with dynamodb, ignore and do not send notification.
      //Else, send message and store the new value in dynamdo

      //for 45 age group
      if (
        vaccineAvailabilityEmailMessage45.length > 0 &&
        telegramChat45 != "-1"
      ) {

        
        var checksum45 = checksum(
          JSON.stringify(vaccineAvailabilityEmailMessage45)
        );
        console.log("For 45 Age Group. Check sum is -> ",checksum45)

        //check in dynamodb table
        var ddbscanparam = {
          TableName: dynamodbTable,
          Key: {
            id: district + telegramToken + "45",
          },
        };
        docClient.get(ddbscanparam, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log("Dynamodb Item is -> ", data.Item);
            if (data.Item) {
              //check the checksum value. If they are same do not send notification
              //If value are different store the new value and send notification.
              if (data.Item.checksum == checksum45) {
                //do nothing
                console.log(
                  "Checksum is same. Will not send notification ->",
                  checksum45
                );
              } else {
                console.log(
                  "Checksum is different, calculated ->",
                  checksum45,
                  " From Dynamodb -> ",
                  data.Item.checksum,
                  " Notification will be send"
                );
                storeChecksumSendNotification(
                  checksum45,
                  vaccineAvailabilityEmailMessage45,
                  "45",telegramChat45
                );
              }
            } else {
              // store new checksum and send notification
              console.log("No Checksum found in dynamodb table. Storing now");
              storeChecksumSendNotification(
                checksum45,
                vaccineAvailabilityEmailMessage45,
                "45",telegramChat45
              );
            }
          }
        });
      }
      //for 18 agegroup
      if (vaccineAvailabilityEmailMessage.length > 0 && telegramChat != "-1") {
        var checksum18 = checksum(
          JSON.stringify(vaccineAvailabilityEmailMessage)
        );
        console.log("For 18 Age Group. Check sum is -> ",checksum18)
        //check in dynamodb table
        var ddbscanparam = {
          TableName: dynamodbTable,
          Key: {
            id: district + telegramToken + "18",
          },
        };
        docClient.get(ddbscanparam, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log("Dynamodb Item is -> ", data.Item);

            if (data.Item) {
              if (data.Item.checksum == checksum18) {
                //do nothing
                console.log(
                  "Checksum is same. Will not send notification ->",
                  checksum18
                );
              } else {
                console.log(
                  "Checksum is different, calculated ->",
                  checksum18,
                  " From Dynamodb -> ",
                  data.Item.checksum
                );
                storeChecksumSendNotification(
                  checksum18,
                  vaccineAvailabilityEmailMessage,
                  "18",telegramChat
                );
              }
            } else {
              console.log("No Checksum found in dynamodb table. Storing now");
              storeChecksumSendNotification(
                checksum18,
                vaccineAvailabilityEmailMessage,
                "18",telegramChat
              );
            }
          }
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
