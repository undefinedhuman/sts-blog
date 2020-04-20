const child_process = require("child_process");
const fs = require("fs");

const repo_link = "https://github.com/undefinedhuman/sts-blog/"

const commitLog = child_process
    .execSync(`git log --reverse --pretty=format:%H---SPLIT---%h---SPLIT---%s---COMMIT---`)
    .toString('utf-8')
    .split("---COMMIT---")
    .map(commit => {
        commit = commit.replace("\n", "");
        const [sha, hash, message] = commit.split("---SPLIT---")
        return { sha, hash, message }
    })
    .filter(commit => Boolean(commit.sha));

const currentChangelog = fs.readFileSync("./CHANGELOG.md", "utf-8");

let commitTypes = [
    { name: "Added",            types: [ "feat", "test" ],                      command: "npm version --no-git-tag-version minor",  commits: [] },
    { name: "Changed",          types: [ "style", "refactor", "build", "ci" ],  command: "npm version --no-git-tag-version minor",                                        commits: [] },
    { name: "Fixed",            types: [ "fix" ],                               command: "npm version --no-git-tag-version patch",  commits: [] },
    { name: "Removed",          types: [ "revert" ],                            command: "",                                        commits: [] },
    { name: "Performance",      types: [ "perf" ],                              command: "",                                        commits: [] },
    { name: "Miscellaneous",    types: [ "docs", "chore" ],                     command: "",                                        commits: [] }
]

commitLog.forEach(commit => {
    commitTypes.forEach(commitType => {
        commitType.types.forEach(type => {
            if(!commit.message.startsWith(type)) return;
            commitType.commits.push(`- ${commit.message.split(": ")[1].split("BREAKING CHANGE")[0]} ([${commit.hash}](${repo_link}/commit/${commit.sha}))\n`)
            if(commitType.command !== "") child_process.execSync(commitType.command)
            if(commit.message.includes("BREAKING CHANGE")) child_process.execSync("npm version --no-git-tag-version major")
        })
    })
});

commitTypes.forEach(type => {
    if(type.commits.length === 0) return;
    console.log(type.name + "\n")
    console.log(type.commits)
})