const path = require('path');

const awsCredentialsFile = require(path.resolve(__dirname, '../aws/aws-credentials.js'));
const awsFileUploadFile = require(path.resolve(__dirname, '../aws/aws-file-upload.js'));
const githubCredentialsFile = require(path.resolve(__dirname, '../github/github-credentials.js'));
const githubFileRequestFile = require(path.resolve(__dirname, '../github/github-file-request.js'));
const githubDataParserFile = require(path.resolve(__dirname, '../github/github-data-parser.js'));

const AwsCredentials = new awsCredentialsFile();
const AwsFileUpload = new awsFileUploadFile();
const GithubCredentials = new githubCredentialsFile();
const GithubDataParser = new githubDataParserFile();
const GithubFileRequest = new githubFileRequestFile();

const octokit = GithubCredentials.getCredentials();
const aws = AwsCredentials.getCredentials();

const s3 = new aws.S3();

module.exports.upload = async (event) => {
  let parsedEvent = JSON.parse(event.body.payload);

  let action = parsedEvent.action;
  let merged = parsedEvent.pull_request.merged;
  let owner = parsedEvent.pull_request.head.repo.owner.login;
  let repo = parsedEvent.repository.name;
  let number = parsedEvent.number;
  let pullRequestFilesData = await GithubFileRequest.getPullRequestFiles(octokit, owner, repo, number);
  let githubJson = await GithubDataParser.getPullRequestParsedData(parsedEvent, pullRequestFilesData);

  if (GithubDataParser.isMerge(action, merged)) {
    AwsFileUpload.s3Upload(s3, githubJson, number, repo)
      .then(() => {
        return {
          statusCode: 200
        };
      })
      .catch(() => {
        return {
          statusCode: 400
        };
      });
  }
};
