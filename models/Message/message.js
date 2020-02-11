
var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var MessageSchema = new mongoose.Schema({
    senderId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    recieverId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    message: String,
    subject: String,
    notificationSeen: {type:Boolean, default:false},
    read: {type:Boolean, default:false}

},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Message', MessageSchema);