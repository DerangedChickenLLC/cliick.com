# Logo Sync Script

The `sync-logos.sh` script pulls the latest logos from the logo repository and copies them to the `images/` directory.

## Setup

1. **Update the script** with your actual logo repository URL:
   ```bash
   nano sync-logos.sh
   # Change LOGO_REPO_URL to your actual repo URL
   ```

2. **Make sure your logo repo has one of these structures:**
   ```
   Option 1:
   logos/
   ├── generate.sh          # Generation script (optional)
   └── output/             # Output directory
       ├── cliick-icon.png
       └── favicon.png

   Option 2:
   logos/
   ├── scripts/
   │   └── generate.sh     # Generation script (optional)
   └── outputs/            # Or dist/, build/, generated/
       └── *.png
   ```

## Usage

```bash
# Run the sync script
./sync-logos.sh
```

The script will:
1. Clone the logo repo to `/tmp/cliick-logos` (or update if already cloned)
2. Run any generation scripts found
3. Copy all image files from the output directory to `images/`
4. Show you what was copied

## Customization

Edit these variables in the script:
- `LOGO_REPO_URL`: Your logo repository URL
- `TARGET_DIR`: Where to copy logos (defaults to `images/`)
- `TEMP_DIR`: Where to clone the repo (defaults to `/tmp/cliick-logos`)

## Adding to .gitignore

If you don't want to track the synced logos in git, add them to `.gitignore`:
```bash
echo "images/cliick-*.png" >> .gitignore
echo "images/favicon.*" >> .gitignore
```
