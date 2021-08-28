const dbConnection = require("./dbConnection")
const express = require('express');
const msg = require('./replies.json')
const {response} = require("express");
const app = express();
const port = 8080;
const db = dbConnection.getConnection();
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Database Connected...')
});

//query all Ghosts currently in the game
app.get('/ghosts', (req, res) => {
    let sql = 'select ghost_type from ghosts';
    let query = db.query(sql,(err,results) => {
        if(err) throw err;
        let ghosts = []
        for (const i in results) {
            ghosts.push(results[i]['ghost_type'])
        }
        res.send(`Ghosts[${results.length}]: ${ghosts.join(", ")}`)
    })
})
//query Evidence for specific Ghost
app.get('/ghost/:name', (req, res) => {
    name = req.params.name.toLowerCase()
    let sql = `SELECT evidence_type FROM ghostevidencetype where ghost_type = "${req.params.name}"`;
    let query = db.query(sql,(err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            res.send(msg.ghostNotFound)
        } else {
        let evidence = []
        for (const i in results) {
            evidence.push(results[i]['evidence_type'])
        }
        let message = name[0].toUpperCase() + name.substring(1) + ': ' + evidence.join(', ')
        res.send(message)
    }
    })
})
app.get('/evidence', (req,res) => {
    let evidence = req.query['msg'].split(' ')
    console.log(evidence)
    let sql;
    if (evidence.length === 2) {
        sql = `select g.ghost_type,e.evidence_type from ghostapi.ghostevidencetype g join ghostapi.ghostevidencetype e on g.ghost_type = e.ghost_type where (g.evidence_type like '%${evidence[0]}%' or g.evidence_type like '%${evidence[1]}%') and (e.evidence_type not like '%${evidence[0]}%' and e.evidence_type not like '%${evidence[1]}%') group by g.ghost_type having count(distinct g.evidence_type) = 2`
    }
    let query = db.query(sql,(err,results) => {
        if (err) throw err;
        let ghostEvidence = []
        let message = 'Possible Ghost(s): ';
        for (const i in results) {
            message += `${results[i]['ghost_type']} (${results[i]['evidence_type']}), `
                ghostEvidence.push({
                ghost: results[i]['ghost_type'],
                evidence: results[i]['evidence_type']
            })
        }
        res.send(message.slice(0,-2))
    })
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})