var mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;
// require('./user');
// require('./conversation');

var messageSchema = new Schema({
        userId: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        conversationId: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Conversation'
            }
        ],
        body: {
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

module.exports = mongoose.model('Message', messageSchema);