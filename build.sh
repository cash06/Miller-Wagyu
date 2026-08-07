#!/usr/bin/env bash
# Assemble the deployable site into dist/.
#
# Source layout is src/*.html with ../images/... references. Deployed layout is flat:
#   dist/index.html      <- src/template-3-gallery.html
#   dist/recipes.html    <- src/recipes.html
#   dist/images/...      <- images/
#
# So two rewrites happen on the way in:
#   ../images/            -> images/                (pages move up one directory level)
#   template-3-gallery.html -> index.html           (nav links point at the new filename)
#
# Only the gallery page and recipes ship. templates 1/2, Testing, temp3fable and the old
# reference site stay out of dist on purpose — they're internal review artifacts.
set -euo pipefail

cd "$(dirname "$0")"

rm -rf dist
mkdir -p dist

cp -R images dist/images

flatten() {
  sed -e 's|\.\./images/|images/|g' \
      -e 's|template-3-gallery\.html|index.html|g' \
      "$1" > "$2"
}

flatten "src/template-3-gallery.html" "dist/index.html"
flatten "src/recipes.html"            "dist/recipes.html"

echo "Built dist/ ($(du -sh dist | cut -f1))"
