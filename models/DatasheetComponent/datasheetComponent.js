var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var DatasheetComponentSchema = new mongoose.Schema({
    // datasheet_id: {type:String, required: true},
    // highway_inspector_id: {type:String, required: true},
    highway_inspector_id: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    datasheet_id: [{ type: Schema.Types.ObjectId, ref: 'Datasheet' }],
    component_name: {type:String, required: true},
    component_score: {type:Number, default:0},
    component_images: {type:Array},
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('DatasheetComponent', DatasheetComponentSchema);