const express = require("express")
const app = express()
const db = require("./database.js")

app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));
const Json2csvParser = require('json2csv').Parser;

var HTTP_PORT = 8000 

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Endpoint 1 - Lista di tutti i record denormalizzati, con paginazione parametrica
app.get("/api/records", (req, res, next) => {

    var sql = "SELECT * FROM denormalized_data LIMIT ?, ?"
    var params = [req.query.offset, req.query.count]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

// Endpoint 2 - Statistiche aggregate filtrate
app.get("/api/stats", (req, res, next) => {
    
    var data = {
        aggregationType: req.query.aggregationType,
        aggregationValue: parseInt(req.query.aggregationValue)
    }

    var sql = "SELECT SUM(capital_gain) as capital_gain_sum, \
                AVG(capital_gain) as capital_gain_avg, \
                SUM(capital_loss) as capital_loss_sum, \
                AVG(capital_loss) as capital_loss_avg, \
                SUM(over_50k = 1) as over_50k_count, \
                SUM(over_50k = 0) as under_50k_count \
                FROM records \
                WHERE " + data.aggregationType + " = " + data.aggregationValue + " "
        var params = []
        db.get(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({"error": err.message});
                return;
            }
            res.json({
                "message":"success",
                "data": {
                    ...data,
                    ...rows}
            })
        });
});

// Endpoint 3 - Download in CSV dei dati denormalizzati
app.get("/api/records/csv/download", (req, res, next) => {

    var sql = "SELECT * FROM denormalized_data"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        const jsonRecords = JSON.parse(JSON.stringify(rows));
        const csvFields = ['id', 'age', 'workclass_id', 'education_level_id', 'education_num', 
        'marital_status_id', 'occupation_id', 'relationship_id', 'race_id', 'sex_id', 'capital_gain',
        'capital_loss', 'hours_week', 'country_id', 'over_50k', 'WorkClass', 'EducationLevel',
        'MaritalStatus', 'Occupation', 'Relationship', 'Race', 'Sex', 'Country'];
        const json2csvParser = new Json2csvParser({ csvFields });
        const csvData = json2csvParser.parse(jsonRecords);

        res.setHeader('Content-disposition', 'attachment; filename=data.csv');
		res.set('Content-Type', 'text/csv');
		res.status(200).end(csvData);
    });
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});