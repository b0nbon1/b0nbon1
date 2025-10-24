#!/bin/bash

# Build script for Hugo site with Tailwind CSS
# This script builds the CSS and then the Hugo site

set -e  # Exit on error

echo "🎨 Building Tailwind CSS..."
tailwindcss -i themes/bon/assets/css/main.css -o themes/bon/assets/css/output.css --minify

echo "🏗️  Building Hugo site..."
hugo --gc --minify

echo "✅ Build complete! Site is in ./public/"


