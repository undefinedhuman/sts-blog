const child_process = require("child_process");
const fs = require("fs");

const currentLog = child_process
    .execSync(`git log --pretty=format:%H---SPLIT---%h---SPLIT---%s---COMMIT---`)
    .toString('utf-8')
    .split("---COMMIT---")
    .map(commit => {
        commit = commit.replace("\n", "");
        const [sha, hash, message] = commit.split("---SPLIT---")
        return { sha, hash, message }
    })
    .filter(commit => Boolean(commit.sha));