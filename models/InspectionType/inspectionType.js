var mongoose = require('mongoose');
var InspectionTypeSchema = new mongoose.Schema({
    name: {type:String, required: true},
    inspectionCategory: String,
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('InspectionType', InspectionTypeSchema);