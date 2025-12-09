#!/bin/bash

# Script to sync logos from the Clique repository
# Usage: ./sync-logos.sh

set -e  # Exit on any error

# Configuration
LOGO_REPO_URL="https://github.com/DerangedChickenLLC/Clique.git"
TEMP_DIR="/tmp/cliick-logos"
TARGET_DIR="$(cd "$(dirname "$0")" && pwd)/images"

echo "🐔 Syncing logos from repository..."

# Clone or update the logo repo
if [ -d "$TEMP_DIR" ]; then
  echo "📦 Updating existing logo repository..."
  cd "$TEMP_DIR"
  git pull origin main
else
  echo "📦 Cloning logo repository..."
  git clone "$LOGO_REPO_URL" "$TEMP_DIR"
  cd "$TEMP_DIR"
fi

# Run generation script if it exists
if [ -f "generate.sh" ]; then
  echo "🎨 Running logo generation script..."
  chmod +x generate.sh
  ./generate.sh
elif [ -f "scripts/generate.sh" ]; then
  echo "🎨 Running logo generation script..."
  chmod +x scripts/generate.sh
  ./scripts/generate.sh
else
  echo "ℹ️  No generation script found, using existing files..."
fi

# Copy specific files from assets folder
echo "📋 Copying logos to $TARGET_DIR..."
mkdir -p "$TARGET_DIR"

# Copy the specific files we need
if [ -f "assets/favicon.png" ]; then
  cp "assets/favicon.png" "$TARGET_DIR/"
  echo "✅ Copied favicon.png"
else
  echo "⚠️  Warning: assets/favicon.png not found"
fi

if [ -f "assets/cliick-icon.png" ]; then
  cp "assets/cliick-icon.png" "$TARGET_DIR/"
  echo "✅ Copied cliick-icon.png"
else
  echo "⚠️  Warning: assets/cliick-icon.png not found"
fi

# Count copied files
COPIED_COUNT=0
[ -f "$TARGET_DIR/favicon.png" ] && ((COPIED_COUNT++))
[ -f "$TARGET_DIR/cliick-icon.png" ] && ((COPIED_COUNT++))

if [ "$COPIED_COUNT" -gt 0 ]; then
  echo "✅ Successfully synced $COPIED_COUNT logo file(s)!"
  echo ""
  echo "Updated files:"
  ls -lh "$TARGET_DIR"/favicon.png "$TARGET_DIR"/cliick-*.png 2>/dev/null || true
else
  echo "⚠️  Warning: No logo files were copied. Check the repository structure."
fi

echo ""
echo "🎉 Logo sync complete!"
