#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== AARTE Push to Production ===${NC}"

# Store the starting branch
STARTING_BRANCH=$(git branch --show-current)
echo -e "Starting branch: ${GREEN}$STARTING_BRANCH${NC}"

# Step 1: Run build
echo -e "\n${YELLOW}[1/6] Running build...${NC}"
if npm run build; then
    echo -e "${GREEN}Build successful!${NC}"
else
    echo -e "${RED}Build failed! Please fix errors before pushing to production.${NC}"
    exit 1
fi

# Step 2: Check for changes to commit
echo -e "\n${YELLOW}[2/6] Checking for changes...${NC}"
if [[ -n $(git status --porcelain) ]]; then
    # Get list of changed files for commit message
    CHANGED_FILES=$(git diff --name-only HEAD 2>/dev/null || git diff --name-only --cached)

    # Generate commit message summary
    ADDED=$(git diff --name-only --diff-filter=A 2>/dev/null | wc -l | tr -d ' ')
    MODIFIED=$(git diff --name-only --diff-filter=M 2>/dev/null | wc -l | tr -d ' ')
    DELETED=$(git diff --name-only --diff-filter=D 2>/dev/null | wc -l | tr -d ' ')

    COMMIT_MSG="Production update: "
    [[ $ADDED -gt 0 ]] && COMMIT_MSG+="${ADDED} added, "
    [[ $MODIFIED -gt 0 ]] && COMMIT_MSG+="${MODIFIED} modified, "
    [[ $DELETED -gt 0 ]] && COMMIT_MSG+="${DELETED} deleted"
    COMMIT_MSG=${COMMIT_MSG%, }  # Remove trailing comma

    # Stage and commit
    echo -e "${YELLOW}[3/6] Committing changes...${NC}"
    git add -A
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}Committed: $COMMIT_MSG${NC}"
else
    echo -e "${GREEN}No changes to commit.${NC}"
fi

# Step 4: Push current branch
echo -e "\n${YELLOW}[4/6] Pushing $STARTING_BRANCH...${NC}"
if git push -u origin "$STARTING_BRANCH" 2>/dev/null; then
    echo -e "${GREEN}Pushed $STARTING_BRANCH successfully!${NC}"
else
    echo -e "${YELLOW}Could not push (no remote or already up to date)${NC}"
fi

# Step 5: If not on main, merge to main and push
if [[ "$STARTING_BRANCH" != "main" ]]; then
    echo -e "\n${YELLOW}[5/6] Merging $STARTING_BRANCH into main...${NC}"
    git checkout main
    git pull origin main 2>/dev/null || true
    git merge "$STARTING_BRANCH" -m "Merge $STARTING_BRANCH into main"

    if git push origin main 2>/dev/null; then
        echo -e "${GREEN}Pushed main successfully!${NC}"
    else
        echo -e "${YELLOW}Could not push main (no remote or already up to date)${NC}"
    fi
else
    echo -e "\n${YELLOW}[5/6] Already on main, skipping merge.${NC}"
fi

# Step 6: Return to starting branch
if [[ "$STARTING_BRANCH" != "main" ]]; then
    echo -e "\n${YELLOW}[6/6] Returning to $STARTING_BRANCH...${NC}"
    git checkout "$STARTING_BRANCH"
fi

echo -e "\n${GREEN}=== Done! ===${NC}"
