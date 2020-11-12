// 1. When am I going 7:00 AM Friday - getting access to notepad piece. Thats where I will put my readme for the demo
// 4. Make a PR to the baseline repo
// THE AUDIENCE WANTS TO GET THE DEFAULT FOR ORACLES
// Basline has yet to define the standard for getting external data - add this to the baseline readme
// How to use oracles to avoid the non-determanism problem
// Cloud IAP - add this IAP in front of the endpoint
// Send me the link for this https://cloud.google.com/functions/docs/securing/function-identity
// Import the Google Cloud client library using default credentials
const { BigQuery } = require('@google-cloud/bigquery')
const { Requester, Validator } = require('@chainlink/external-adapter')
const bigquery = new BigQuery()

let called = 0

async function bigQuery(query) {
    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
        query: query,
        // Location must match that of the dataset(s) referenced in the query.
        location: 'US',
    }
    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options)
    console.log(`Job ${job.id} started.`)
    const response = await job.getQueryResults()
    return response
}

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
    if (data.Response === 'Error') return true
    return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
    query: false,
    rowNumber: false,
    column: false
}

// curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 0, "data": {"query":"test", "column":"test"} }'

const createRequest = async (input, callback) => {
    // The Validator helps you validate the Chainlink request data
    const validator = new Validator(callback, input, customParams)
    const jobRunID = validator.validated.id
    const query = validator.validated.data.query || "SELECT * FROM`blockchain-etl-internal.ethereum_aave.LendingPool_event_FlashLoan_history` order by date(block_timestamp) desc limit 1"
    const rowNumber = validator.validated.data.rowNumber || 0
    const column = validator.validated.data.column || "block_number"
    try {
        response = await bigQuery(query, rowNumber, column)
        console.log(response)
        response.data = {}
        const [listedResponse] = response
        response.data.result = listedResponse[rowNumber][column]
        response.status = 200
        callback(response.status, Requester.success(jobRunID, response))
    }
    catch (error) {
        callback(500, Requester.errored(jobRunID, error))
    }

}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
    createRequest(req.body, (statusCode, data) => {
        res.status(statusCode).send(data)
    })
}

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
    createRequest(event, (statusCode, data) => {
        callback(null, data)
    })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
    createRequest(JSON.parse(event.body), (statusCode, data) => {
        callback(null, {
            statusCode: statusCode,
            body: JSON.stringify(data),
            isBase64Encoded: false,
        })
    })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest

// Sample Call
// curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 0, "data": {"title":"HELLO" }}'