const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

const sampleQuery = "SELECT * FROM`blockchain-etl-internal.ethereum_aave.LendingPool_event_FlashLoan_history` order by date(block_timestamp) desc limit 1"
const sampleRow = 0
const sampleColumn = 'block_number'
describe('createRequest', () => {
  const jobID = '1'

  context('successful calls', () => {
    const requests = [
      { name: 'id not supplied', testData: { data: { query: sampleQuery, row: sampleRow, column: sampleColumn } } },
      { name: 'query/row/column', testData: { id: jobID, data: { query: sampleQuery, row: sampleRow, column: sampleColumn } } },
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.isNotEmpty(data.data)
          assert.isAbove(Number(data.result), 0)
          assert.isAbove(Number(data.data.result), 0)
          done()
        })
      })
    })
  })

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      { name: 'row not supplied', testData: { id: jobID, data: { query: sampleQuery, column: sampleColumn } } },
      { name: 'column not supplied', testData: { id: jobID, data: { query: sampleQuery, row: sampleRow } } },
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
