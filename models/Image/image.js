var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var ImageSchema = new mongoose.Schema({
    datasheet_id: [{ type: Schema.Types.ObjectId, ref: 'Datasheet' }],
    images: {type:Array, required: true},
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Image', ImageSchema);