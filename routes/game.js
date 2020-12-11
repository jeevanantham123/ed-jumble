const router = require('express').Router();
let Game = require('../models/game.model');
router.route('/getGame').get((req, res) => {
    req.session.userAction = true;
    req.session.save();
    req.session.cookie.expires = false;
    req.session.cookie.maxAge = 5000000000*60*10000;
      
    Game.find()
            .then(games => {
                res.json({games, sessionID:req.sessionID});
            })
            .catch(err => res.status(400).json('Error: ' + err));

    });

router.route('/add').post((req,res)=>{
    const gameName = req.body.gameName;
    const gameImage= req.body.gameImage;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const questions = req.body.questions;
    const steps = req.body.steps;
    const gameBgColor = req.body.gameBgColor;
    const gameCreator = req.body.gameCreator;

    const newGame = new Game({
        gameName,
        gameImage,
        startTime,
        endTime,
        questions,
        steps,
        gameBgColor,
        gameCreator
    });

    newGame.save()
        .then(() => res.json('Game added!'))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/winner').post((req,res) => {
    if(req.cookies['connect.sid']){
        const email = req.body.email;
        var flag = 0;
        var modifiedObj;
        const gameDetails = req.body.gameDetails;
        req.session.email = email;
        if(req.session.gameDetails){
            req.session.gameDetails.forEach(obj => {
                if(obj.gameName === gameDetails.gameName){
                    obj.count = gameDetails.count;
                    if(obj.timer)
                    { 
                    if(obj.timer > gameDetails.timer){
                        obj.timer = gameDetails.timer;
                    }
                    }
                    else{
                        obj.timer = gameDetails.timer;
                    }
                    flag = 1;
                    modifiedObj = obj;
                }
            });
            if(flag == 0){
                req.session.gameDetails.push(gameDetails);
                modifiedObj = gameDetails;
            }
        }
        else{
            req.session.gameDetails = new Array;
            req.session.gameDetails.push(gameDetails);
        }
        req.session.save();



        //winners update
        Game.find({'gameName':gameDetails.gameName})
        .then((data) => {
            var winnersDetailsUpdate = new Array;
            // console.log(data);
            if(data[0].winnersDetails.length > 0){
                // console.log('if');
                    winnersDetailsUpdate = data[0].winnersDetails;
                    //console.log(winnersDetailsUpdate);
                    var f = null;
                    winnersDetailsUpdate.forEach((gd,index) => {
                       if(gd.email === email){
                           f = index;
                       }
                    });
                    // console.log(winnersDetailsUpdate);
                    if(f === null){
                        // console.log('if');
                        gameDetails.email = email;
                        winnersDetailsUpdate.push(gameDetails);
                        winnersDetailsUpdate.sort((a,b) => (a.timer > b.timer) ? 1 : ((b.timer > a.timer) ? -1 : 0)); 
                        Game.updateOne({'gameName':gameDetails.gameName},{$set:{winnersDetails:winnersDetailsUpdate}})
                        .then((data) =>{
                         //console.log('success');
                        })
                        .catch(err => res.status(400).json('Error: ' + err));
                    }
                    if(f !== null){
                        // console.log('else');
                       // console.log(modifiedObj);
                       if(modifiedObj === undefined){
                        modifiedObj = gameDetails;
                       }
                        modifiedObj.email = email;
                        winnersDetailsUpdate[f] = modifiedObj;
                        winnersDetailsUpdate.sort((a,b) => (a.timer > b.timer) ? 1 : ((b.timer > a.timer) ? -1 : 0)); 
                        Game.updateOne({'gameName':gameDetails.gameName},{$set:{winnersDetails:winnersDetailsUpdate}})
                        .then((data) =>{
                         //console.log('success');
                        })
                        .catch(err => res.status(400).json('Error: ' + err));
                    }
                // console.log(winnersUpdate);
            }
            else{
               // console.log('else');
                        gameDetails.email = email;
                        winnersDetailsUpdate.push(gameDetails);
                        // console.log(winnersUpdate);
                        Game.updateOne({'gameName':gameDetails.gameName},{$set:{winnersDetails:winnersDetailsUpdate}})
                        .then((data) =>{
                            // console.log('success');
                        })
                        .catch(err => res.status(400).json('Error: ' + err));
            }
        })
        .catch(err => console.log(err));

        res.status(200).json('success');
    }
    else{
        req.session.destroy();
        res.status(400).json('un-authorize');
    }
});

router.route('/adminGames').post((req, res) => {
    const username = req.body.username;
    Game.find({'gameCreator': username})
    .then((data) => {
        res.json(data);        
    })
    .catch((err) =>{
      console.log(err);
    })
  })

router.route('/enableDisable').post((req,res)=>{
    const id = req.body.id;
    Game.findById(id)
    .then((data)=>{
        const enableModified = !data.enable;
        Game.updateOne({'_id':id},{$set:{enable:enableModified}})
        .then((data) =>{
            res.json('success');
        })
        .catch(err => console.log(err))
    }
    )
    .catch((err)=>{
        console.log(err);
    })
})
module.exports = router;