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

        //send Email if flag is true
        if (sendEmail == "true") {
          var cooloffParam = {
            TableName: coolOffTable,
          };
          docClient.scan(cooloffParam, function (err, cooloffdata) {
            if (err) {
              console.log("Error in fetching cool off - > ", err);
            } else {
              console.log("Cooloff Data is --> ", cooloffdata.Items);
              if (cooloffdata.Items.length <= 0) {
                var emails = [];
                var ddbparam = {
                  TableName: tableName,
                };
                docClient.scan(ddbparam, function (err, ddbdata) {
                  if (err) {
                    console.log(
                      "Error while getting data from Dynamodb->",
                      err
                    );
                  } else {
                    ddbdata.Items.forEach((item) => {
                      emails.push(item.email);
                    });
                    console.log("Email Id that will be notified -> ", emails);
                    var params = {
                      Destination: {
                        BccAddresses: emails,
                        ToAddresses: ["sankeyraut@gmail.com"],
                      },
                      Message: {
                        Body: {
                          Text: {
                            Data: JSON.stringify(
                              vaccineAvailabilityEmailMessage
                            ),
                          },
                        },

                        Subject: {
                          Data:
                            "ALERT " +
                            districtName +
                            " : COWIN Vaccine Available",
                        },
                      },
                      Source: "sankeyraut@gmail.com",
                    };

                    ses.sendEmail(params, function (err, sendemaildata) {
                      if (err) {
                        console.error(err, err.stack);
                      } else {
                        console.log("Email Send -->", sendemaildata.MessageId);
                        var expiryTime = new Date();
                        expiryTime.setHours(today.getHours() + cooloffHrs);
                        // add data in dynamodb cool off table
                        var insertparam = {
                          TableName: coolOffTable,
                          Item: {
                            district: districtName,
                            timetolive: expiryTime.getTime(),
                          },
                        };
                        docClient.put(insertparam, function (err, insertdata) {
                          if (err) {
                            console.error(
                              "Unable to add item. Error JSON:",
                              JSON.stringify(err, null, 2)
                            );
                          } else {
                            console.log(
                              "Added item:",
                              JSON.stringify(insertdata, null, 2)
                            );
                          }
                        });
                      }
                    });
                  }
                });
              } else {
                console.log("Into Cool Off period. Will not send notification");
              }
            }
          });
        } else {
          console.log("Skipping sending Email");
        }
      }
    })
    .catch(function (error) {
      console.log("Error in calling API --> ", error);
      /*
      axios.get("https://api.telegram.org/bot"+telegramToken+"/sendMessage?chat_id="+telegramChat+"&text=Alert for Sanket Raut-"+JSON.stringify(error))
        .then(function (response) {
          console.log("Message Send to telegram")
        }) 
      */
      // handle error - DO NOT SEND EMAIL
      /*
      var emails = [];
      var ddbparam = {
        TableName: tableName,
      };
      docClient.scan(ddbparam, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          data.Items.forEach((item) => {
            emails.push(item.email);
          });
          console.log(emails);
          var errorStr = JSON.stringify(error);
          errorStr = errorStr + " Users affected -> " + JSON.stringify(emails);
          console.log(errorStr);
          var params = {
            Destination: {
              ToAddresses: ["sankeyraut@gmail.com"],
            },
            Message: {
              Body: {
                Text: { Data: errorStr },
              },

              Subject: {
                Data: "ALERT " + districtName + " : COWIN App Needs checking",
              },
            },
            Source: "sankeyraut@gmail.com",
          };
          var sendPromise = ses.sendEmail(params).promise();
          sendPromise
            .then(function (data) {
              console.log(data.MessageId);
            })
            .catch(function (err) {
              console.error(err, err.stack);
            });
        }
      });*/
    })
    .then(function () {
      // always executed
    });
};
