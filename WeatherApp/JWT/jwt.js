var express = require('express');
var jwt = require("jsonwebtoken");
const app = express();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// app.get('/api', function (req, res) {
//     res.json({
//         res: 'my api'
//     });
// });

app.use(express.json());       
app.use(express.urlencoded({extended: true})); 
 
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/loginother.html");
});

app.post('/api/token', function (req, res) {
    const dom = new JSDOM(res.body);
    const value = "Weather";
    const user = { String: value };
    const token = jwt.sign({user}, 'my_secret_key');
    res.json({
        token: token
    });
});

app.get('/api/authorized', ensureToken, function (req, res) {
    jwt.verify(req.token, 'my_secret_key', function (err, data) {
        if (err) {
            res.sendStatus(404);
        }
        else {
            res.json({
                text: 'this is an authorized data',
                data: data
            });
        }
    })
});

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
   
        next();
    } else {
        res.sendStatus(404);
    }
}

app.listen(3000, function () {
    console.log("Weather App listening on port 3000")
})