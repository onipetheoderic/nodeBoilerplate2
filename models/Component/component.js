var mongoose = require('mongoose');
var InspectionTypeSchema = new mongoose.Schema({
    name: {type:String, required: true},
    rams_Structure_Key: String,
    structureName: String,
    zone: String,
    state: String,
    roadNumber: String,
    roadName: String,
    gpsLatitude: String,
    gpsLongitude: String,
    recordedBy:[{
        type: mongoose.Schema.Types.ObjectId, //this is the recorder who is a registered user
        ref: 'User'
      }],
    CheckedBy: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
      }],
    Date: String,
    inspectionType: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'InspectionType'
      }]

    	
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('InspectionType', InspectionTypeSchema);

/*

RAMS Structure Key
Structure Name
Zone
State
Road Number
Road Name
GPS Latitude
GPS Longitude
Recorded By
Checked By
Date

*/ 