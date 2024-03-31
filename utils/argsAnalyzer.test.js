const ArgsAnalyzer = require('./argsAnalyzer.js')

const argsAnalyzer = new ArgsAnalyzer()

describe('Check argument nomenclature', () => {
  test('With good structure', () => {
    jest.replaceProperty(process, 'argv', ['', '', '--test'])
    expect(argsAnalyzer.hasArg([{name: 'test', withValue: false}]).test).toBeTruthy()
  })
  test('With bad structure - bad prefix', () => {
    jest.replaceProperty(process, 'argv', ['', '', '-test', '---test'])
    expect(argsAnalyzer.hasArg([{name: 'test', withValue: false}]).test).toBeFalsy()
  })
  test('With bad structure - bad suffix', () => {
    jest.replaceProperty(process, 'argv', ['', '', '--test:value'])
    expect(argsAnalyzer.hasArg([{name: 'test', withValue: true}]).test).toBeFalsy()
  })
})

describe('Check argument with values', () => {
  test('Getting argument, with expected value which is present', () => {
    jest.replaceProperty(process, 'argv', ['', '', '--filter=test'])
    expect(argsAnalyzer.hasArg([{name: 'filter', withValue: true}]).filter).toEqual('test')
  })

  test('Getting argument, with expected value which is not present', () => {
    jest.replaceProperty(process, 'argv', ['', '', '--filter='])
    expect(argsAnalyzer.hasArg([{name: 'filter', withValue: true}]).filter).toBeUndefined()
  })
})

describe('Check argument without values', () => {
  test('Getting argument, without expected value which is not present', () => {
    jest.replaceProperty(process, 'argv', ['', '', '--count'])
    expect(argsAnalyzer.hasArg([{name: 'count', withValue: false}]).count).toBeTruthy()
  })

  test('Getting argument, without expected value which is present', () => {
    jest.replaceProperty(process, 'argv', ['', '', '--count=test'])
    expect(argsAnalyzer.hasArg([{name: 'count', withValue: false}]).count).toBeUndefined()
  })
})

describe('Check no argument', () => {
  test('Getting argument, without expected value which is not present', () => {
    jest.replaceProperty(process, 'argv', ['', '', '--count'])
    expect(argsAnalyzer.hasArg([])).toEqual({})
  })

  test('Getting argument, without expected value which is present', () => {
    jest.replaceProperty(process, 'argv', ['', '', '--count=test'])
    expect(argsAnalyzer.hasArg(null)).toEqual({})
  })
})
