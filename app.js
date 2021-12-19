const path = require("path");
const express = require("express");
require("dotenv").config();
const cors = require('cors')
const mysql = require('mysql2');

const app = express();

app.use(cors());

const router = express.Router();
app.use("/", router)
router.use(express.json());
router.use(express.urlencoded({ extended: true}));

var config = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    port: process.env.PORT,
    ssl: false
};

const connection = new mysql.createConnection(config);

connection.connect((err) => {
    if (err) {
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    } else {
        console.log("Connection established.")
        console.log(`Running on port ${config.port}`)
        //insertDatabase();
        //selectAllDatabase();
    }
});


router.get("/", (req, res) => {
    console.log("Go to homepage");
    res.send({connection: true});
})


router.get("/reservation-getall", (req,res) => {
    connection.query('SELECT * FROM hotelbooking', (error, results) => {
        if (error) throw error;
        console.log(results);
        res.send({error: false, results: results, message: "Hotel Booking Data"})
    })
})

router.post("/reservation-post", (req, res) => {
    console.log("Initiate Reservation\n");

    console.log(req.body);

    const name = req.body.name;
    const tel = req.body.tel;
    const email = req.body.email;
    const roomtype = req.body.roomtype;
    const datefrom = req.body.datefrom;
    const dateto = req.body.dateto;
    const spreq = req.body.spreq;

    let sql = 'INSERT INTO hotelbooking (customerName, tel, email, roomtype, datefrom, dateto, spreq) VALUES (?, ?, ?, ?, ?, ?, ?);'

    connection.query(sql, [name, tel, email, roomtype, datefrom, dateto, spreq] ,(error, results, fields) => {
        if (error) throw error;
        else console.log(`Inserted ${results.affectedRows} row(s).`);
    })
})

//For test sql
function insertDatabase() {
    let sql = 'INSERT INTO hotelbooking (customerName, tel, email, roomtype, datefrom, dateto, spreq) VALUES (?, ?, ?, ?, ?, ?, ?);'
    connection.query(sql, ["Sonogami Hoshimiya", "0876953888", "sonogami_hoshimiya@hotmail.com", "standard", "2021-12-19", "2021-12-31", "Nothing"], (error, results, fields) => {
        if (error) throw error;
        else console.log(`Inserted ${results.affectedRows} row(s).`);
    })
}

function selectAllDatabase() {
    let sql = 'SELECT * FROM hotelbooking'
    connection.query(sql, (error, results, fields) => {
        if (error) throw error;
        else console.log(results);
    })
}


app.listen(3030, () => {
    console.log(`Server listening at Port 3030`);
})