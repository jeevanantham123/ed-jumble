const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    gameName:{
        type: String,
        required: true,
        unique:true
    },
    gameImage:{
        type: String,
        required: true
    },
    startTime:{
        type: Date,
        required: true
    },
    endTime:{
        type: Date,
        required: true
    },
    questions:{
        type: Array,
        required: true
    },
    steps:{
        type: Array,
        required: true
    },
    gameBgColor:{
        type: String,
        required: true
    },
    gameCreator:{
        type: String,
        required: true
    },
    winners:{
        type:Array
    },
    winnersDetails:{
        type:Array
    },
    enable:{
        type:Boolean,
        default:true
    }
},{
    timestamps: true
})


const Game = mongoose.model('Game',gameSchema);


module.exports = Game;