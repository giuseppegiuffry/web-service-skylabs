const sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "exercise01.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
    } else {
        console.log('Connected to the SQLite database.')  
    }
});

// Creazione della tabella con i dati denormalizzati
db.run("CREATE TABLE IF NOT EXISTS denormalized_data \
    AS SELECT rec.*, \
    w.name as WorkClass, \
    el.name as EducationLevel, \
    ms.Name as MaritalStatus, \
    o.name as Occupation, \
    rel.Name as Relationship, \
    rac.name as Race, \
    s.Name as Sex, \
    c.name as Country \
    FROM records rec \
    JOIN workclasses w ON rec.workclass_id = w.id \
    JOIN education_levels el ON rec.education_level_id = el.id \
    JOIN marital_statuses ms ON rec.marital_status_id = ms.id \
    JOIN occupations o ON rec.occupation_id = o.id \
    JOIN relationships rel ON rec.relationship_id = rel.id \
    JOIN races rac ON rec.race_id = rac.id \
    JOIN sexes s ON rec.sex_id = s.id \
    JOIN countries c ON rec.country_id = c.id;", (err) => {
        if(err) {
            console.error(err.message)
        }
    });

module.exports = db