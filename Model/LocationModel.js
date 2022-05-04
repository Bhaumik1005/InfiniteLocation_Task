const mongoose = require('mongoose');



const LocationSchema = new mongoose.Schema({

    location:{
        type:String,
        required: true,
        unique: true
    },
    parentLocation:{
        type:mongoose.Schema.Types.ObjectId,
        default: null
    },
    product:{
        type: Array
    },
    childProducts:{
        type: Array,
    },
    // nextLocation :{
    //     type : Array,
    //     // default: null
    // },
    referIndex:{
        type: String,
        // required: true,
    }
})



const Location = mongoose.model("Location", LocationSchema);
module.exports = Location;