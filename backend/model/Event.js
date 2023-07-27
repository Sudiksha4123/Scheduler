const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    label: {
        type : String,
        required : true
    },
    dateStart : {
        type : Date,
        required : true
    },
    dateEnd : {
        type : Date,
        required : true
    },
    time : {
        type : String,
    },
    description : {
        type : String,
    },
    repeat : {
        type : Object,
    
    },
    priority: {
        type : String,
    }
})

module.exports = Events = mongoose.model('Events' , EventSchema);