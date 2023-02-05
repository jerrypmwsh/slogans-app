#!/usr/bin/env sh

# abort on errors
set -ex

# build
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

cd -
pwd
git add -A .
git status
git commit -m 'deploy'

# if you are deploying to https://jerrypmwsh.github.io
# git push -f git@github.com:jerrypmwsh/<USERNAME>.github.io.git main

# if you are deploying to https://jerrypmwsh.github.io/slogans-app
git push -f https://github.com/jerrypmwsh/slogans-app.git.git main:gh-pages
