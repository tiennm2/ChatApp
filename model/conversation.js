var mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;
// require('./user');

var conversationSchema = new Schema({
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

module.exports = mongoose.model('Conversation', conversationSchema);