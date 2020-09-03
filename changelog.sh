#!/bin/bash
REPO_URL=https://github.com/undefinedhuman/sts-blog/

ALL_TAS=$(git tag -l | wc -l)

createMessage() {
  # STRING=$(echo "$1" | awk -F: '{$2}')
  # echo "$1" ["$2"\("$REPO_URL"/commit/"$2"\)]
  echo "wefwef"
}

if [ "$ALL_TAS" = 0 ]; then
    echo "Repository contains no tags. Please make a tag first."
    exit 1
else
    LATEST_TAG=$(git describe --tags "$(git rev-list --tags --max-count=1)")
    IFS=$'\n' read -r COMMITS <<< "$(git log HEAD..."$LATEST_TAG" --pretty=format:"%H")"

    echo "${COMMITS[@]}"

    ADDED=()
    CHANGED=()
    FIXED=()
    REMOVED=()
    PERF=()
    MISC=()

    for COMMIT in "${COMMITS[@]}"; do

      MESSAGE=$(git log -1 "${COMMIT}" --pretty=format:%s)
      SHA=$(git log -1 "$COMMIT" --pretty=format:%h)

      if grep -q "Add" <<< "$MESSAGE"; then
        ADDED+=("$(createMessage "$MESSAGE" "$SHA")")
      elif grep -q "Update" <<< "$MESSAGE"; then
        CHANGED+=("$(createMessage "$MESSAGE" "$SHA")")
      elif grep -q "Fix" <<< "$MESSAGE"; then
        FIXED+=("$(createMessage "$MESSAGE" "$SHA")")
      elif grep -q "Remove" <<< "$MESSAGE"; then
        REMOVED+=("$(createMessage "$MESSAGE" "$SHA")")
      elif grep -q "Performance" <<< "$COMMIT"; then
        PERF+=("$(createMessage "$MESSAGE" "$SHA")")
      else
        MISC+=("$(createMessage "$MESSAGE" "$SHA")")
      fi
    done

    # echo MISC[@]

    CHANGELOG="# Version $()"
    CHANGELOG+='\n'

    for CHANGE in "${MISC[@]}"; do
      CHANGELOG+="$CHANGE"
      CHANGELOG+="\n"
    done

    echo -e $CHANGELOG > CHANGELOG.md
fi