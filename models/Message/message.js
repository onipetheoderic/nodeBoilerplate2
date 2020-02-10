var mongoose = require('mongoose');
var MessageSchema = new mongoose.Schema({
    senderId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    recieverId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    message: String,

},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Message', MessageSchema);