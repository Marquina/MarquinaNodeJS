echo "Installing Homebrew"
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
echo "Updating Homebrew"
brew update
echo "Checking Homebrew"
brew doctor
echo "Installing Nodejs"
brew install node
echo "Installing npm modules"
npm install
