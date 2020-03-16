var mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

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

module.exports = mongoose.model('User', userSchema);
