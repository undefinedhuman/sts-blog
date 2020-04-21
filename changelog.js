const child_process = require("child_process");
const fs = require("fs");

const repo_link = "https://github.com/undefinedhuman/sts-blog/"

const commitLog = child_process
    .execSync(`git log ${child_process.execSync('git describe --tags `git rev-list --tags --max-count=1`').toString('utf-8').replace("\n", "")}...HEAD --reverse --pretty=format:%H---SPLIT---%h---SPLIT---%s---COMMIT---`)
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
    { name: "Changed",          types: [ "style", "refactor", "build", "ci" ],  command: "",                                        commits: [] },
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

const version = child_process.execSync("npm --loglevel silent run version");

child_process.execSync(`git checkout master`)
child_process.execSync(`git add .`)
child_process.execSync(`git commit -m "chore(version): Bump to ${version}"`)
child_process.execSync(`git tag -am "Tag for v${version}" v${version}`)

const versionCommit = child_process
    .execSync(`git log HEAD~1...HEAD --pretty=format:%H---SPLIT---%h---SPLIT---%s---COMMIT---`)
    .toString('utf-8')
    .split("---COMMIT---")
    .map(commit => {
        commit = commit.replace("\n", "");
        const [sha, hash, message] = commit.split("---SPLIT---")
        return { sha, hash, message }
    })
    .filter(commit => Boolean(commit.sha))[0];

commitTypes[5].commits.push(`- Bump to ${version} ([${versionCommit.hash}](${repo_link}/commit/${versionCommit.sha}))\n`)

let options = {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
};

let changelog = `# Version ${version} (${
    new Date().toLocaleString('en-us', options)
})\n\n`;

commitTypes.forEach(commitType => {
    if(commitType.commits.length === 0) return;
    changelog += `## ${commitType.name}\n`
    commitType.commits.forEach(commit => {
        changelog += commit
    })
    changelog += "\n"
})

fs.writeFileSync("./CHANGELOG.md", `${changelog}${currentChangelog}`);

child_process.execSync("git add .")
child_process.execSync("git commit --amend --no-edit")
child_process.execSync("git push -u changelog master")
child_process.execSync("git push changelog --tags")