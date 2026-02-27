# GitHub Repository Setup Commands

This file contains all the commands used to create and push code to a new GitHub repository.

## Prerequisites

- Have Git installed on your computer
- Have a GitHub account
- Create a new repository on GitHub (https://github.com)

## Step-by-Step Commands

### 1. Initialize Git Repository

```bash
git init
```

_Initializes a new Git repository in the current directory_

### 2. Add Files to Staging

```bash
git add .
```

_Adds files to the staging area for commit_

### 3. Create Initial Commit

```bash
git commit -m "Initial commit: Add test.js file"
```

_Creates the first commit with a descriptive message_

### 4. Add Remote Repository

```bash
git remote add origin https://github.com/bharathbdev/deploynodejs.git
```

_Connects your local repository to the GitHub repository_
**Note: Replace the URL with your actual repository URL**

### 5. Push to GitHub

```bash
git push -u origin master
```
