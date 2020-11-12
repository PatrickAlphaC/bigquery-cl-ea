# BigQuery External Adapter

## Quickstart

Prerequisites:
- A [google cloud account](https://console.cloud.google.com/) (setup takes 2 minutes)
- [nodejs](https://nodejs.org/en/)
- [yarn](https://classic.yarnpkg.com/en/docs/cli/install/)

1. [Setup your API authentication for Google Big Query](https://cloud.google.com/bigquery/docs/reference/libraries#client-libraries-install-nodejs)

For most up to date information, follow the link above. We will go through the steps here as well though. 

- [Create Serivce Account Key](https://console.cloud.google.com/apis/credentials/serviceaccountkey?_ga=2.108391435.802978260.1605093328-241701440.1605093193)
- Create an environment variable with the location of the JSON service key

`export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"`
   
2. Create a 

### Install to GCP

- In Functions, create a new function, choose to ZIP upload
- Click Browse and select the `external-adapter.zip` file
- Select a Storage Bucket to keep the zip in
- Function to execute: gcpservice
- Click More, Add variable (repeat for all environment variables)
  - NAME: API_KEY
  - VALUE: Your_API_key
