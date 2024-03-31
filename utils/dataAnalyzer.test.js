const DataAnalyzer = require('./dataAnalyzer.js')

describe('Test filterNames', () => {
  const analyzer = new DataAnalyzer([])

  /**
   * Filter all names which contains searched word, wherever it is
   */
  test('check if name contains word', () => {
    const names = [{name: 'test'}, {name: 'contient test'}, {name: 'ne contient pas'}, {name: 'contienttestmemesansespace'}]
    const result = analyzer.filterNames(names, 'test')
    expect(result).toEqual([{name: 'test'}, {name: 'contient test'}, {name: 'contienttestmemesansespace'}])
  })

  /**
   * Filter must ignore case
   */
  test('check case sensitive', () => {
    const names = [{name: 'test'}, {name: 'TEST'}, {name: 'TeSt'}]
    const result = analyzer.filterNames(names, 'test')
    expect(result).toEqual([{name: 'test'}, {name: 'TEST'}, {name: 'TeSt'}])
  })

  test('check special characters', () => {
    const names = [{name: "Przewalski's Horse"}, {name: 'Duck'}, {name: 'Two-toed'}]
    let result = analyzer.filterNames(names, '\'s')
    expect(result).toEqual([{name: "Przewalski's Horse"}])
    result = analyzer.filterNames(names, ' ')
    expect(result).toEqual([{name: "Przewalski's Horse"}])
    result = analyzer.filterNames(names, '-')
    expect(result).toEqual([{name: 'Two-toed'}])
  })
})

describe('Test Filter', () => {
  const dataAnalyzer = new DataAnalyzer(['people', 'animals'])

  test('check animals filter which remove people and country', () => {
    const datas = [{
      name: 'Country 1',
      people:
        [{
          name: 'People 1.1',
          animals:
            [
              {name: 'Duck'},
              {name: 'Cobra'},
              {name: 'Crow'}
            ]
        },
          {
            name: 'People 1.2',
            animals:
              [
                {name: 'Kowari'},
                {name: 'Caecilian'},
                {name: 'Common Genet'},
                {name: 'Chipmunk'}
              ]
          }
        ]
    },
      {
        name: 'Country 2',
        people:
          [{
            name: 'People 2.1',
            animals:
              [{name: 'Zebra'},
                {name: 'Fly'},
                {name: 'Blue Iguana'},
                {name: 'Emu'},
                {name: 'Numbat'}]
          }
          ]
      }
    ]

    const result = dataAnalyzer.filter(datas, 'd')
    expect(result).toEqual([
      {
        name: 'Country 1',
        people: [
          {name: 'People 1.1', animals: [{name: 'Duck'}]}
        ]
      }
    ])
  })

  test('check when all is remove', () => {
    const datas = [{
      name: 'Country 1',
      people:
        [{
          name: 'People 1.1',
          animals:
            [
              {name: 'Duck'},
              {name: 'Cobra'},
              {name: 'Crow'}
            ]
        },
          {
            name: 'People 1.2',
            animals:
              [
                {name: 'Kowari'},
                {name: 'Caecilian'},
                {name: 'Common Genet'},
                {name: 'Chipmunk'}
              ]
          }
        ]
    },
      {
        name: 'Country 2',
        people:
          [{
            name: 'People 2.1',
            animals:
              [{name: 'Zebra'},
                {name: 'Fly'},
                {name: 'Blue Iguana'},
                {name: 'Emu'},
                {name: 'Numbat'}]
          }
          ]
      }
    ]
    const result = dataAnalyzer.filter(datas, '@')
    expect(result).toEqual([])
  })

  test('check if datas is null', () => {
    const datas = null
    const result = dataAnalyzer.filter(datas, 'test')
    expect(result).toEqual([])
  })

  test('check ignore fields not corresponding to dataAnalyzer order param', () => {
    const reverseDataAnalyzer = new DataAnalyzer(['people', 'not_exists'])
    const datas = [{
      name: 'Country 1',
      people:
        [{
          name: 'People 1.1',
          animals:
            [
              {name: 'Duck'},
              {name: 'Cobra'},
              {name: 'Crow'}
            ]
        },
          {
            name: 'People 1.2',
            animals:
              [
                {name: 'Kowari'},
                {name: 'Caecilian'},
                {name: 'Common Genet'},
                {name: 'Chipmunk'}
              ]
          }
        ]
    },
      {
        name: 'Country 2',
        people:
          [{
            name: 'People 2.1',
            animals:
              [{name: 'Zebra'},
                {name: 'Fly'},
                {name: 'Blue Iguana'},
                {name: 'Emu'},
                {name: 'Numbat'}]
          }
          ]
      }
    ]

    const result = reverseDataAnalyzer.filter(datas, 'd')
    expect(result).toEqual([])
  })
})

/**
 * There are not many possible argument combination, so it can be exhaustive
 */
describe('Test on apply', () => {
  const dataAnalyzer = new DataAnalyzer(['people', 'animals'])
  const spyOnFilter = jest.spyOn(dataAnalyzer, 'filter')
  const spyOnDisplayCount = jest.spyOn(dataAnalyzer, 'displayCount')

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('with all functionality', () => {
    dataAnalyzer.apply([], 'filterValue', true)
    expect(spyOnFilter).toHaveBeenCalled()
    expect(spyOnDisplayCount).toHaveBeenCalled()
  })

  test('with no functionality', () => {
    dataAnalyzer.apply([], '', false)
    expect(spyOnFilter).not.toHaveBeenCalled()
    expect(spyOnDisplayCount).not.toHaveBeenCalled()
  })

  test('with only filter', () => {
    dataAnalyzer.apply([], 'Test', false)
    expect(spyOnFilter).toHaveBeenCalled()
    expect(spyOnDisplayCount).not.toHaveBeenCalled()
  })

  test('with only count', () => {
    dataAnalyzer.apply([], '', true)
    expect(spyOnFilter).not.toHaveBeenCalled()
    expect(spyOnDisplayCount).toHaveBeenCalled()
  })
})

describe('Test displayCount', () => {
  const dataAnalyzer = new DataAnalyzer(['people', 'animals'])
  const datas = [{
    name: 'Country 1',
    people:
      [{
        name: 'People 1.1',
        animals:
          [
            {name: 'Duck'},
            {name: 'Cobra'},
            {name: 'Crow'}
          ]
      },
        {
          name: 'People 1.2',
          animals:
            [
              {name: 'Kowari'},
              {name: 'Caecilian'},
              {name: 'Common Genet'},
              {name: 'Chipmunk'}
            ]
        }
      ]
  },
    {
      name: 'Country 2',
      people:
        [{
          name: 'People 2.1',
          animals:
            [{name: 'Zebra'},
              {name: 'Fly'},
              {name: 'Blue Iguana'},
              {name: 'Emu'},
              {name: 'Numbat'}]
        }
        ]
    }
  ]
  const expectedDatasWithCount = [{
    name: 'Country 1 [2]',
    people:
      [{
        name: 'People 1.1 [3]',
        animals:
          [
            {name: 'Duck'},
            {name: 'Cobra'},
            {name: 'Crow'}
          ]
      },
        {
          name: 'People 1.2 [4]',
          animals:
            [
              {name: 'Kowari'},
              {name: 'Caecilian'},
              {name: 'Common Genet'},
              {name: 'Chipmunk'}
            ]
        }
      ]
  },
    {
      name: 'Country 2 [1]',
      people:
        [{
          name: 'People 2.1 [5]',
          animals:
            [{name: 'Zebra'},
              {name: 'Fly'},
              {name: 'Blue Iguana'},
              {name: 'Emu'},
              {name: 'Numbat'}]
        }
        ]
    }
  ]

  test('Test displayCount', () => {
    expect(dataAnalyzer.displayCount(datas)).toEqual(expectedDatasWithCount)
  })
})
