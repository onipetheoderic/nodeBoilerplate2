var mongoose = require('mongoose');
var DatasheetComponentSchema = new mongoose.Schema({
    datasheet_id: {type:String, required: true},
    contract_id: {type:String, required: true},
    component_id: {type:String, required: true},
    component_name: {type:String, required: true},
    component_score: {type:Number, default:0},
    component_images: {type:Array},
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('DatasheetComponent', DatasheetComponentSchema);