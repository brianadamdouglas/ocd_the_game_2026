# Installing Node.js for Testing

## Quick Installation Options

### Option 1: Using Homebrew (Recommended for macOS)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

### Option 2: Direct Download

1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version for macOS
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Option 3: Using nvm (Node Version Manager)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell
source ~/.zshrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify
node --version
```

## After Installation

Once Node.js is installed, run:

```bash
cd /Users/ai_whisperer/Documents/AI_Development/ENDGAMES/OCD_GAME
npm install
npm test
```

