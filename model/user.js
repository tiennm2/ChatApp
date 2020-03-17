const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
        firstname: String,
        lastname: String,
        email: {
            type: String
        },
        password: {
            type: String
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);
const User = mongoose.model('User', userSchema);

module.exports = User;
