# BigQuery External Adapter

## Quickstart

Prerequisites:
- A [google cloud account](https://console.cloud.google.com/) (setup takes 2 minutes)
- [nodejs](https://nodejs.org/en/)
- [yarn](https://classic.yarnpkg.com/en/docs/cli/install/)

1. [Setup your API authentication for Google Big Query](https://cloud.google.com/bigquery/docs/reference/libraries#client-libraries-install-nodejs)

For most up to date information, follow the link above. We will go through the steps here as well though. 

- [Enable the BigQuery API](https://console.cloud.google.com/flows/enableapi?apiid=bigquery&_ga=2.11098546.745296034.1605185710-241701440.1605093193)
- [Create Serivce Account Key](https://console.cloud.google.com/apis/credentials/serviceaccountkey?_ga=2.108391435.802978260.1605093328-241701440.1605093193)
- Create an environment variable with the location of the JSON service key

`export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"`
   
2. Clone this repo, and start the server

```
git clone https://github.com/PatrickAlphaC/bigquery-cl-ea
cd bigquery-cl-ea
yarn
yarn start
```
See [Install Locally](#install-locally) for running curls

## Input Params

- `query`: The SQL Query for bigquery. You can see tables and test queries in the [BigQuery GCP UI](https://console.cloud.google.com/bigquery?_ga=2.45530530.745296034.1605185710-241701440.1605093193).
- `column`: The column you want to grab a value from.
- `row`: The row number you want to grab a value from. 

Right now you can only post your status. Please make a PR to add functionality :)

## Sample cURL

```bash
curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 0, "data": {"query":"SELECT * FROM`blockchain-etl-internal.ethereum_aave.LendingPool_event_FlashLoan_history` order by date(block_timestamp) desc limit 1", "row":1, "column": "block_number"}}'
```

## Output

```
{
  jobRunID: 0,
  data: { result: "2403b2c5a2e3b20c482d97610d7d10d898bba971d77874eef3c0a6c11c61e3a6" },
  result: "2403b2c5a2e3b20c482d97610d7d10d898bba971d77874eef3c0a6c11c61e3a6",
  statusCode: 200
}
```

This is the ID of your tweet.

## Install Locally

Install dependencies:

```bash
yarn
```

### Test

Run the local tests:

```bash
yarn test
```

Natively run the application (defaults to port 8080):

### Run

```bash
yarn start
```

## Call the external adapter/API server

```bash
curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 0, "data": {"query":"SELECT * FROM`blockchain-etl-internal.ethereum_aave.LendingPool_event_FlashLoan_history` order by date(block_timestamp) desc limit 1", "row":1, "column": "block_number"}}'
```

## Docker

If you wish to use Docker to run the adapter, you can build the image by running the following command:

```bash
docker build . -t external-adapter
```

Then run it with:

```bash
docker run -p 8080:8080 -it external-adapter:latest
```

## Serverless hosts

### You will have to add your authentication key to a file

### Create the zip

```bash
zip -r external-adapter.zip .
```

### Install to AWS Lambda

- In Lambda Functions, create function
- On the Create function page:
  - Give the function a name
  - Use Node.js 12.x for the runtime
  - Choose an existing role or create a new one
  - Click Create Function
- Under Function code, select "Upload a .zip file" from the Code entry type drop-down
- Click Upload and select the `external-adapter.zip` file
- Handler:
    - index.handler for REST API Gateways
    - index.handlerv2 for HTTP API Gateways
- Add the environment variable (repeat for all environment variables):
  - GOOGLE_APPLICATION_CREDENTIALS: /path/to/file.json
- Save

#### To Set Up an API Gateway (HTTP API)

If using a HTTP API Gateway, Lambda's built-in Test will fail, but you will be able to externally call the function successfully.

- Click Add Trigger
- Select API Gateway in Trigger configuration
- Under API, click Create an API
- Choose HTTP API
- Select the security for the API
- Click Add

#### To Set Up an API Gateway (REST API)

If using a REST API Gateway, you will need to disable the Lambda proxy integration for Lambda-based adapter to function.

- Click Add Trigger
- Select API Gateway in Trigger configuration
- Under API, click Create an API
- Choose REST API
- Select the security for the API
- Click Add
- Click the API Gateway trigger
- Click the name of the trigger (this is a link, a new window opens)
- Click Integration Request
- Uncheck Use Lamba Proxy integration
- Click OK on the two dialogs
- Return to your function
- Remove the API Gateway and Save
- Click Add Trigger and use the same API Gateway
- Select the deployment stage and security
- Click Add

### Install to GCP

- In Functions, create a new function, choose to ZIP upload
- Click Browse and select the `external-adapter.zip` file
- Select a Storage Bucket to keep the zip in
- Function to execute: gcpservice
- Click More, Add variable (repeat for all environment variables)
  - GOOGLE_APPLICATION_CREDENTIALS: /path/to/file.json
