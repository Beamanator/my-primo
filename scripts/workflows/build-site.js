const { Octokit } = require("@octokit/core");
const core = require("@actions/core");

try {
    // `who-to-greet` input defined in action metadata file
    const siteData = core.getInput("site");
    console.log("site data:");
    console.log(siteData);
    // const time = (new Date()).toTimeString();
    // core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
console.log("done");
return;

const OCTOKIT_TOKEN = process.env.OCTOKIT_TOKEN || null;

if (!OCTOKIT_TOKEN) {
    console.log("Err: Missing Octokit Token.");
    return;
}

console.log("init Octokit");

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({
    auth: OCTOKIT_TOKEN,
});

const FILES = {
    PRIMO_JSON: {
        path: "",
    },
    FILE_HTML,
    FILE_JS,
    FILE_CSS,
};

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
