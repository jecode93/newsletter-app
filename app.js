const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { request } = require("http");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const apiKey = "c4bfb382f9966137d00027470d3c7546-us13";
    // const listId = "3594319283"
    const url = "https://us13.api.mailchimp.com/3.0/lists/3594319283"
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;



    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);



    const options = {
        method: "POST",
        auth: "jecode93:" + apiKey,
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
})


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
