class DataAnalyzer {
  /**
   * Names of branch names in data tree, sorted from base to leaf
   * @param branchs
   */
  constructor(branchs) {
    this.branchs = branchs
  }

  /**
   * Add child count on elements
   * @param {*[]} datas
   * @param {number} step
   * @returns {*}
   */
  displayCount(datas, step = 0) {
    // No need to display count on last step of data tree
    if (step < this.branchs.length) {
      // Getting the field name of array of childs
      const fieldName = this.branchs[step]
      datas.forEach(data => {
        data.name += ` [${data[fieldName].length}]`
        this.displayCount(data[fieldName], step + 1)
      })
    }
    return datas
  }

  /**
   * filter data tree
   * @param {*[]} datas
   * @param {string} filterValue text to search in name
   * @param {number} step
   * @returns {{name: string}[]|*[]}
   */
  filter(datas, filterValue, step = 0) {
    // If it is not at the last step
    if (step < this.branchs.length) {
      // Getting the field name of array of childs
      const fieldName = this.branchs[step]
      const result = []
      // For each element
      datas?.forEach(data => {
        // Filter the children of element
        data[fieldName] = this.filter(data[fieldName], filterValue, step + 1)
        // If element has children after filtering, adding element to result
        if (data[fieldName] && data[fieldName].length > 0) {
          result.push(data)
        }
      })
      return result
    } else {
      // If it is the last step, filtering the names
      return this.filterNames(datas, filterValue)
    }
  }

  /**
   * Filter elements which name contains value
   * Normally, the client would have had to decide whether the filter was case sensitive
   * @param {{name: string}[]} names
   * @param {string} value
   * @returns {{name: string}[]}
   */
  filterNames(names, value) {
    const valueToCheck = value.toUpperCase()
    return names?.filter(name => name.name?.toUpperCase().includes(valueToCheck))
  }

  /**
   * Apply treatment on data
   * Normally, the client would have had to decide if one of parameter if necessary, and if we can use both on same time
   * @param {*[]} datas
   * @param {string} filterValue
   * @param {boolean} showCount add count to element name
   */
  apply(datas, filterValue, showCount) {
    if (filterValue) {
      datas = this.filter(datas, filterValue)
    }
    if (showCount) {
      datas = this.displayCount(datas)
    }
    return datas
  }
}

module.exports = DataAnalyzer
