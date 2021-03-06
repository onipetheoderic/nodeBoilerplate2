var mongoose = require('mongoose');
var DatasheetSchema = new mongoose.Schema({
    name: {type:String, required: true},
    contract_id: String,
    highway_inspector_id: String,
    project_type: String,
    datasheet_comment: String,
    images: Array,
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Datasheet', DatasheetSchema);