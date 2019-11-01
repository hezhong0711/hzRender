#!/bin/zsh
npm run build
rm -rf ../yjw/ListApp/hzrender/lib
cp -rf ./lib ../yjw/ListApp/hzrender/lib
