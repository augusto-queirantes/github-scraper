const path = require('path');

const githubFile = require(path.resolve(__dirname, '../github/github_data.js'));
const awsFile = require(path.resolve(__dirname, '../aws/aws_data.js'));

const githubDataParser = new githubFile();
const awsData = new awsFile() ;

module.exports.upload = async (event) => {
  const { body: { pull_request, repository } } = event;

  let action = event.body.action;
  let merged = pull_request.merged;
  let owner = pull_request.head.repo.owner.login;
  let repo = repository.name;
  let number = pull_request.number;
  let pullRequestFilesData = await githubDataParser.getPullRequestFiles(owner, repo, number);
  let githubJson = githubDataParser.getPullRequestParsedData(event, pullRequestFilesData);

  if (action === 'closed' && merged === true) {
    let request = await awsData.s3Upload(githubJson, number, repo);

    if (request) {
      return {
        request: request
      };
    }
  }
};
