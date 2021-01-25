const { Octokit } = require("@octokit/core");

console.log("init Octokit");

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({
    auth: `c02a5600b65808c974375293935833eba1337091`,
});

console.log("get file");

// https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event
octokit
    .request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: "beamanator",
        repo: "my-primo",
        path: "test/file.txt",
    })
    .then((res) => {
        let sha = res.data.sha;
        console.log("sha:", sha);

        return octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
            owner: "beamanator",
            repo: "my-primo",
            path: "test/file.txt",
            message: `"file" updated`,
            // 'Required if you are updating a file. The blob SHA of the file being replaced.'
            sha,
            content: Buffer.from("Hello World 3").toString("base64"),
        });
    })
    .then(() => {
        console.log("success. finished.");
    })
    .catch((err) => {
        console.log("err", err);
    });
