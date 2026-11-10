const mongoose = require ('mongoose');

const scoreSchema = new mongoose.Schema({
    nombre: {
        type: "string",
        required: "true",
        trim: "true",
        maxlength: "30"
    },
    puntaje: {
        type: "number",
        required: "true",
        min: 0
    },
    deviceId: {
        type: "string",
        required: "true",
        unique: true
    }
},{
        timestamps: true
    }

);

module.exports = mongoose.model('Score', scoreSchema);
    