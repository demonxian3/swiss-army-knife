#!/bin/bash
cp /Users/demon/Desktop/project/scanTree/main.mjs ./public/
yarn run build
zip -r dist.zip dist/  && open .