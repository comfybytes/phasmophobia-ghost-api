const dbase = require("./dbase")
const db = dbase.dbase
const express = require('express');
const msg = require('./replies.json')
//const {response} = require("express");
const app = express();
const port = 8080;

app.get('/ghosts', (req, res) => { //query all Ghosts currently in the game
    let sql = 'select ghost_type from ghosts';
    db.query(sql,(err,results) => {
        if(err) throw err;
        let ghosts = []
        for (const i in results) {
            ghosts.push(results[i]['ghost_type'])
        }
        res.send(`Ghosts[${results.length}]: ${ghosts.join(", ")}`)
    })
});


app.get('/ghost/:name', (req, res) => { //query Evidence for specific Ghost
    name = req.params.name.toLowerCase()
    let sql = "SELECT evidence_type FROM ghostevidencetype where ghost_type = ?";
    db.query(sql, name, (err, results) => {
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
    let sql;
    if (evidence.length === 2) {
        sql = `select g.ghost_type,e.evidence_type from ghostevidencetype g join ghostevidencetype e on g.ghost_type = e.ghost_type where (g.evidence_type like ? or g.evidence_type like ?) and (e.evidence_type not like ? and e.evidence_type not like ?) group by g.ghost_type having count(distinct g.evidence_type) = 2`
        evidence = [`%${evidence[0]}%`,`%${evidence[1]}`,`%${evidence[0]}%`,`%${evidence[1]}`]
    }
    db.query(sql,evidence,(err,results) => {
        if (err) throw err;
        let message = 'Possible Ghost(s): ';
        for (const i in results) {
            message += `${results[i]['ghost_type']} (${results[i]['evidence_type']}), `
        }
        res.send(message.slice(0,-2))
    })
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})