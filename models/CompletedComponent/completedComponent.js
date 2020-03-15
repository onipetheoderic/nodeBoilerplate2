var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var CompletedComponentSchema = new mongoose.Schema({
    datasheet_id: [{ type: Schema.Types.ObjectId, ref: 'CompletedDatasheet' }],
    problem_name: {type:String, required: true},
    severity: String,
    extent: String,
    urgent: {type:Boolean, default:false},
    highway_inspector_id: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    
},{
    timestamps: true//this will automatically add the createdAt and the updatedAt field for us
});

module.exports = mongoose.model('CompletedComponent', CompletedComponentSchema);