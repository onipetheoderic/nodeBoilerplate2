var mongoose = require('mongoose');
var DatasheetSchema = new mongoose.Schema({
    name: {type:String, required: true},
    contract_id: String,
    highway_inspector_id: String,
    project_type: String,
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Datasheet', DatasheetSchema);