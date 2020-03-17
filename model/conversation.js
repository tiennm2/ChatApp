const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;