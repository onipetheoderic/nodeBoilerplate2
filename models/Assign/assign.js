var mongoose = require('mongoose');
var AssignSchema = new mongoose.Schema({
    highwayContractorId: String,
    userId:String,
    contractId:String,
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('Assign', AssignSchema);