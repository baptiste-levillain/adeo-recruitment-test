const DataAnalyzer = require('./utils/dataAnalyzer.js')
const ArgsAnalyzer = require('./utils/argsAnalyzer.js')

// Getting data
const data = require('./data.js').data

// Check if command has some require argument
const commandArguments = new ArgsAnalyzer().hasArg([
  {name: 'filter', withValue: true},
  {name: 'count', withValue: false}
])
const dataAnalyzer = new DataAnalyzer(['people', 'animals'])

console.dir(dataAnalyzer.apply(data, commandArguments.filter, commandArguments.count), {
  depth: null,
  maxArrayLength: null
})
