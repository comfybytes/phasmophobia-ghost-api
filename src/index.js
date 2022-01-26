const dbase = require("./dbase")
const db = dbase.dbase
const express = require('express');
const msg = require('./strings.json')
const app = express();
const port = 5000;

// Query all ghosts currently in the game
app.get('/ghosts', (req, res) => {
    const sql = 'select ghost_type from ghosts';
    db.query(sql,(err,results) => {
        let ghosts = [];
        for (const i in results) {
            ghosts.push(results[i]['ghost_type']);
        }
        res.send(`Ghosts[${results.length}]: ${ghosts.join(", ")}`);
    })
});

// Query evidence for specific ghost
app.get('/ghost/:name', (req, res) => {
    const name = req.params.name.replace(/\s+/g, ' ').trim().toLowerCase();
    let sql = "SELECT evidence_type FROM ghostevidencetype where ghost_type = ?";
    db.query(sql, name, (err, results) => {
        if (results.length === 0) {
            res.send(msg.replies.ghostNotFound);
        } else {
            let evidence = [];
            for (const i in results) {
                evidence.push(results[i]['evidence_type']);
            }
            let message = name[0].toUpperCase() + name.substring(1) + ': ' + evidence.join(', ');
            res.send(message);
        }
    })
})

// Query possible ghosts and remaining evidence based on the number of evidence
app.get('/evidence', (req,res) => {
    let evidence = req.query['msg'].replace(/\s+/g, ' ').trim().split(' ');
    let sql;
    switch (evidence.length) {
        case 1:
            sql = msg.sql.evidence1;
            evidence = [`%${evidence[0]}%`,`%${evidence[0]}%`,`%${evidence[0]}%`];
            break;
        case 2:
            sql = msg.sql.evidence2;
            evidence = [`%${evidence[0]}%`,`%${evidence[1]}%`,`%${evidence[0]}%`,`%${evidence[1]}%`];
            break;
        case 3:
            sql = msg.sql.evidence3;
            evidence = [`%${evidence[0]}%`,`%${evidence[1]}%`,`%${evidence[2]}%`];
            break;
    }
    db.query(sql,evidence,(err,results) => {
        let message = "";
        switch (evidence.length) {
            case 3:
                if (evidence[0] !== evidence[1]) {
                    res.send(`Ghost: ${results[0]['ghost_type']}`);
                    return;
                } else {
                    for (const i in results) {
                        message += `${results[i]['ghost_type']} (${results[i]['evidence1']} | ${results[i]['evidence2']}), `;
                    }
                }
                break;
            case 4:
                for (const i in results) {
                    message += `${results[i]['ghost_type']} (${results[i]['evidence_type']}), `;
                }
                break;
        }
        if (message.length === 0) {
            res.send(msg.replies.noEvidence);
        } else {
            res.send(`Possible Ghost(s): ${message.slice(0, -2)}`);
        }
    })
})

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
})
