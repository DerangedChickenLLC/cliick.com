#!/bin/bash

# Script to sync legal documents from the Documents repository
# Usage: ./sync-documents.sh

set -e  # Exit on any error

# Configuration
DOCS_REPO_URL="https://github.com/DerangedChickenLLC/Documents.git"
TEMP_DIR="/tmp/cliick-documents"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "📄 Syncing legal documents from repository..."

# Clone or update the documents repo
if [ -d "$TEMP_DIR" ]; then
  echo "📦 Updating existing documents repository..."
  cd "$TEMP_DIR"
  git pull origin main || git pull origin master
else
  echo "📦 Cloning documents repository..."
  git clone "$DOCS_REPO_URL" "$TEMP_DIR"
  cd "$TEMP_DIR"
fi

# Check if markdown files exist
if [ ! -f "Cliick-ToS.md" ]; then
  echo "❌ Error: Cliick-ToS.md not found in repository"
  exit 1
fi

if [ ! -f "Cliick-Privacy-Policy.md" ]; then
  echo "❌ Error: Cliick-Privacy-Policy.md not found in repository"
  exit 1
fi

echo "✅ Found required documents"

# Function to convert markdown to HTML
convert_md_to_html() {
  local input_file=$1
  local output_file=$2
  local title=$3
  
  echo "🔄 Converting $input_file to HTML..."
  
  # Check if pandoc is available
  if command -v pandoc &> /dev/null; then
    # Use pandoc for best quality conversion
    pandoc "$input_file" -f markdown -t html -o "$output_file" \
      --metadata title="$title"
    echo "✅ Converted using pandoc"
  else
    # Fallback: Use Python markdown (if available)
    if command -v python3 &> /dev/null && python3 -c "import markdown" 2>/dev/null; then
      python3 << EOF
import markdown
import sys

with open('$input_file', 'r') as f:
    md_content = f.read()

html = markdown.markdown(md_content, extensions=['extra', 'nl2br'])

with open('$output_file', 'w') as f:
    f.write(html)
EOF
      echo "✅ Converted using Python markdown"
    else
      # Basic conversion using sed (fallback)
      echo "⚠️  Warning: Neither pandoc nor Python markdown found. Using basic conversion."
      echo "<div class='markdown-content'>" > "$output_file"
      
      # Basic markdown to HTML conversion
      sed -e 's/^# \(.*\)/<h1>\1<\/h1>/' \
          -e 's/^## \(.*\)/<h2>\1<\/h2>/' \
          -e 's/^### \(.*\)/<h3>\1<\/h3>/' \
          -e 's/^\- \(.*\)/<li>\1<\/li>/' \
          -e 's/^\*\*\(.*\)\*\*/<strong>\1<\/strong>/g' \
          -e 's/^\*\(.*\)\*/<em>\1<\/em>/g' \
          -e 's/^$/<\/p><p>/' \
          "$input_file" >> "$output_file"
      
      echo "</div>" >> "$output_file"
      echo "✅ Basic conversion complete"
    fi
  fi
}

# Convert documents
convert_md_to_html "Cliick-ToS.md" "/tmp/tos-temp.html" "Terms of Service"
convert_md_to_html "Cliick-Privacy-Policy.md" "/tmp/privacy-temp.html" "Privacy Policy"

# Copy to destination
mkdir -p "$SCRIPT_DIR/terms"
mkdir -p "$SCRIPT_DIR/privacy"

cp /tmp/tos-temp.html "$SCRIPT_DIR/terms/tos.html"
cp /tmp/privacy-temp.html "$SCRIPT_DIR/privacy/privacy.html"

# Clean up temp files
rm /tmp/tos-temp.html /tmp/privacy-temp.html

echo ""
echo "✅ Successfully synced legal documents!"
echo "   - terms/tos.html"
echo "   - privacy/privacy.html"
echo ""

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
  echo "💡 Tip: Install pandoc for better markdown conversion:"
  echo "   brew install pandoc"
fi

echo "🎉 Document sync complete!"
