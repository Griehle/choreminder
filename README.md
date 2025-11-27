# choreminder
A family Chore reminder for Mobile use

## Getting Started: Pushing Your Local Code to This Repository

If you have code in your local IDE that you want to push to this repository, follow these steps:

### Option 1: If you already have a local git repository

If your local project is already a git repository (has a `.git` folder):

```bash
# Navigate to your local project directory
cd /path/to/your/local/choreminder

# Add this GitHub repository as a remote
git remote add origin https://github.com/Griehle/choreminder.git

# Stage all your files
git add .

# Commit your changes
git commit -m "Initial commit from local IDE"

# Push to GitHub (you may need to use 'main' or 'master' depending on your setup)
git push -u origin main
```

### Option 2: If your local project is NOT a git repository yet

If your local project doesn't have git initialized:

```bash
# Navigate to your local project directory
cd /path/to/your/local/choreminder

# Initialize a new git repository
git init

# Add this GitHub repository as a remote
git remote add origin https://github.com/Griehle/choreminder.git

# Stage all your files
git add .

# Commit your changes
git commit -m "Initial commit from local IDE"

# Push to GitHub
git push -u origin main
```

### Option 3: Using GitHub Desktop or VS Code

**GitHub Desktop:**
1. Open GitHub Desktop
2. File → Add Local Repository → Select your project folder
3. If not a git repo, it will offer to create one
4. Publish repository or push changes

**VS Code:**
1. Open your project folder in VS Code
2. Click the Source Control icon (or press `Ctrl+Shift+G`)
3. Click "Initialize Repository" if needed
4. Stage your changes with the `+` button
5. Enter a commit message and click the checkmark
6. Click "Publish Branch" or use the sync button

### Troubleshooting

**If you get an error about the remote already existing:**
```bash
git remote remove origin
git remote add origin https://github.com/Griehle/choreminder.git
```

**If you get an error about conflicting histories:**
```bash
# First, fetch the remote changes
git fetch origin main

# Review what will be merged, then merge with unrelated histories allowed
git merge origin/main --allow-unrelated-histories

# Resolve any merge conflicts, then:
git push -u origin main
```

**If you need to authenticate:**
- Use a Personal Access Token (PAT) instead of a password
- Generate one at: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
