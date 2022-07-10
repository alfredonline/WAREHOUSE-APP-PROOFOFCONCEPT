const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const jimp = require("jimp");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const fs = require("fs");

require("dotenv").config();

const PORT = 3090;

// connect to database

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "jr_pet_products",
});

// functions

async function WriteBlackSquareToImage(binData, res) {
  const fetchImageLocal = await jimp.read("./Media/WarehouseLayout_Base.png");
  const fetchImageOverlay = await jimp.read("./Media/Overlay.png");

  // save image to output folder after overlaying image with coordinates etc

  fetchImageLocal
    .blit(fetchImageOverlay, binData[0].Xcoordinates, binData[0].Ycoordinates)
    .write(`./output/${binData[0].binNo}.png`);

  setTimeout(() => {
    res.sendFile(`./output/${binData[0].binNo}.png`, {
      root: __dirname,
    });
  }, 2000);
}

async function CheckDBThenReturnData(binNo) {
  return new Promise(function (resolve, reject) {
    db.query(
      `SELECT * FROM warehouse_codes_testing WHERE binNo = "${binNo}"`,
      (err, results) => {
        if (results === undefined) {
          console.log(err);
          reject(new Error("That wasn't found"));
        } else resolve(results);
      }
    );
  });
}

// routing

app.get("/", (req, res) => {
  res.sendFile("./Public/index.html", { root: __dirname });
});

app.use("./output", express.static("output"));

app.get("/warehouse", async (req, res) => {
  res.sendFile(`./Media/404.png`, { root: __dirname });
});

app.get("/warehouse/:binnumber", async (req, res) => {
  //   if the user enters png into the end of the url, we just have to split the characters and search db normally. this is unlikely to happen, but just in case
  if (req.params.binnumber.includes(".png")) {
    req.params.binnumber = req.params.binnumber.substring(0, 3);
  }

  const data = await CheckDBThenReturnData(req.params.binnumber, false);
  if (data.length === 0) {
    res.send("YOU TRIED SEARCHING FOR A FILE THAT DOESNT YET EXIST.");
  } else {
    WriteBlackSquareToImage(data, res);
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});



// DATA TO RUN OVER TO DELETE THE FILES, BUT IN A REAL WORLD CASE I WOULD JUST FETCH THE CONTENTS OF THE SQL TABLE AND LOOP OVER 
// THAT BUT AS THIS IS A TEST APP I THINK IT'S FINE TO JUST STORE IT LIKE THIS 


const data = [
  {
    id: 1,
    binNo: "A13",
    Xcoordinates: 1840,
    Ycoordinates: 160,
  },
  {
    id: 2,
    binNo: "C11",
    Xcoordinates: 1650,
    Ycoordinates: 860,
  },
  {
    id: 3,
    binNo: "D14",
    Xcoordinates: 1835,
    Ycoordinates: 1500,
  },
  {
    id: 4,
    binNo: "E02",
    Xcoordinates: 580,
    Ycoordinates: 1820,
  },
  {
    id: 5,
    binNo: "E10",
    Xcoordinates: 1500,
    Ycoordinates: 1820,
  },
];


// DELETE FILES AFTER TWO MINUTES

setInterval(() => {
  data.forEach(({ binNo }) => {
    if (fs.existsSync(`./output/${binNo}.png`)) {
      fs.unlink(`./output/${binNo}.png`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}, 120000);
