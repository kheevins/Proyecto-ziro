const mongoose = require ('mongoose');
const contactSchema = new mongoose.Schema({
    name: {
        type: "string",
        required: "true",
        trim: "true",
        maxlength: "100"
    },
    email: {
        type: "string",
        required: "true",
        trim: "true",
        lowercase: "true",
        maxlength: "100"
    },
    rol: {
        type: "string",
        required: "true",
        enum: ['Catequista', 'Párroco', 'Padre de Familia', 'Otro']
    },
    parroquia: {
        type: "string",
        required: "true",
        trim: "true",
        maxlength: "100"
    },
    message: {
        type:"string",
        required: "true",
        trim: "true",
        maxlength: "1500"
    }

    },
    {
        timestamps: true
    }
);

const Contact = mongoose.model('Contac', contactSchema);
module.exports = Contact;