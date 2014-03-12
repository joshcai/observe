var mongoose = require('mongoose')
  , Schema = mongoose.Schema

/**
 * Question/Answer Schema
 */


var ActivitySchema = new Schema({
  // question: { type: Schema.Types.ObjectId, ref: 'Question' },
  desc: { type: String, default: '' },
  start: { type: Date, default: Date.now },
  stop: { type: Date}
})

mongoose.model('Activity', ActivitySchema)

