var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var CompletedDatasheetSchema = new mongoose.Schema({
    rams_structure_key: String,
    structure_name: String,
    zone: String,
    state: String,
    road_number: String,
    road_name: String,
    gps_latitude: String,
    gps_longitude: String,
    recorded_by: String,
    checked_by: String,
    datasheet_id: [{ type: Schema.Types.ObjectId, ref: 'CompletedDatasheet' }],
    highway_inspector_id: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('CompletedDatasheet', CompletedDatasheetSchema);


