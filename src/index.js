const dbase = require("./dbase")
const db = dbase.dbase
const express = require('express');
const msg = require('./strings.json')
const app = express();
const port = 5000;

app.get('/ghosts', (req, res) => {//query all Ghosts currently in the game
    let sql = 'select ghost_type from ghosts';
    db.query(sql,(err,results) => {
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
        if (results.length === 0) {
            res.send(msg.replies.ghostNotFound)
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
app.get('/evidence', (req,res) => { //query possible ghosts and remaining evidence based on the number of evidence
    let evidence = req.query['msg'].split(' ')
    let sql;
    switch (evidence.length) {
        case 1:
            sql = msg.sql.evidence1
            evidence = [`%${evidence[0]}%`,`%${evidence[0]}%`,`%${evidence[0]}%`]
            console.log(evidence)
            break;
        case 2:
            console.log("first switch case in 2")
            sql = msg.sql.evidence2
            evidence = [`%${evidence[0]}%`,`%${evidence[1]}%`,`%${evidence[0]}%`,`%${evidence[1]}%`]
            break;
        case 3:
            sql = msg.sql.evidence3
            evidence = [`%${evidence[0]}%`,`%${evidence[1]}%`,`%${evidence[2]}%`]
            break;
    }
    db.query(sql,evidence,(err,results) => {
        let message = "";
        console.log(results);
        switch (evidence.length) {
            case 3:
                if (evidence[0] !== evidence[1]) {
                    res.send('Ghost: ' + results[0]['ghost_type'])
                    return;
                } else {
                    for (const i in results) {
                        message += `${results[i]['ghost_type']} (${results[i]['evidence1']} | ${results[i]['evidence2']}), `
                    }
                }
                break;
            case 4:

                for (const i in results) {
                    message += `${results[i]['ghost_type']} (${results[i]['evidence_type']}), `
                }
                break;
        }
        if (message.length === 0) {
            res.send(msg.replies.noEvidence)
        } else {
            res.send('Possible Ghost(s): ' + message.slice(0, -2))
        }
    })
})
app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`)
})