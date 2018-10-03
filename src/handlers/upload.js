const awsCredentialsFile = require(__dirname + '/../aws/aws-credentials.js');
const awsFileUploadFile = require(__dirname + '/../aws/aws-file-upload.js');
const githubCredentialsFile = require(__dirname + '/../github/github-credentials.js');
const githubFileRequestFile = require(__dirname + '/../github/github-file-request.js');
const githubDataParserFile = require(__dirname + '/../github/github-data-parser.js');

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

  const { pull_request } = parsedEvent

  let action = parsedEvent.action;
  let merged = pull_request.merged;
  let owner = pull_request.head.repo.owner.login;
  let repo = parsedEvent.repository.name;
  let number = parsedEvent.number;
  let pullRequestFilesData = await GithubFileRequest.getPullRequestFiles(octokit, owner, repo, number);
  let githubJson = await GithubDataParser.getPullRequestParsedData(parsedEvent, pullRequestFilesData);

  if (GithubDataParser.isMerge(action, merged)) {
    return AwsFileUpload.s3Upload(s3, githubJson, number, repo)
      .then(() => { return { 'statusCode': 200 }; })
      .catch(() => { return { 'statusCode': 400 }; });
  }
};
