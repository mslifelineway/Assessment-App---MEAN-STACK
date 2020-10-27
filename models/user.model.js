//init
const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }
});

const UserModel = mongoose.model('Users', UserSchema);

module.exports = mongoose.model('Users');
