class ArgsAnalyzer {
  /**
   * Check if commands contains asked argument
   * Normally, the client would have had to decide if present of unneeded argument fail the treatment
   * and what happen when we have many occurrence of same argument (here we just get the first)
   * @param {{name: string, withValue : boolean}[]} neededArguments arguments name
   * @returns {{arg: value, arg2: value}} value if argument need it, or true if not need it, or undefined if argument not present
   */
  hasArg(neededArguments) {
    if (!Array.isArray(neededArguments)) {
      return {}
    }
    const args = this.extractArgs()
    return neededArguments.reduce((accumulator, neededArgument) => {
      accumulator[neededArgument.name] = args.filter(arg => arg.name === neededArgument.name && Boolean(arg.value) === neededArgument.withValue)
        .map(arg => !neededArgument.withValue || arg.value)
        .shift()
      return accumulator
    }, {})
  }

  /**
   * Extract arguments corresponding to expected pattern (--filter=value, --count)
   * @returns {{name: string, value: string}[]}
   */
  extractArgs() {
    const regex = /^--([a-z]+)(=(.+))?$/
    return process.argv
      .map(arg => arg.match(regex))
      .filter(match => match)
      .map(match => ({name: match[1], value: match[3]}))
  }
}

module.exports = ArgsAnalyzer
