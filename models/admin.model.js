//init
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }
});

/* MODEL METHODS (static methods) */

//find by credentials
AdminSchema.statics.findByCredentials = function (email, password) {
    let Admin = this;
    return Admin.findOne({ email }).then((admin) => {
        if (!admin) return Promise.reject();

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, admin.password, (err, res) => {
                if (res) {
                    resolve(admin);
                }
                else {
                    reject();
                }
            })
        })
    })
}




const AdminModel = mongoose.model('Admin', AdminSchema);

module.exports = mongoose.model('Admin');
