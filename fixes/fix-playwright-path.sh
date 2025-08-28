#!/bin/bash

# Fix Playwright Test Paths for wb.html
# This script updates all Playwright test files to use the correct path to wb.html

echo -e "\033[36m🔍 Fixing Playwright test paths for wb.html...\033[0m"

# Define the test directory
TEST_DIR="./Tests/playwright"
TOTAL_CHANGES=0

# Create a timestamp for backups
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

# Function to update file references
update_file() {
  local file=$1
  local changes=0
  local file_changed=false
  local backup_file="${file}.backup.${TIMESTAMP}"
  
  # Create a temporary file for processing
  temp_file="${file}.tmp"
  
  # Make a backup copy before changing
  cp "$file" "$backup_file"
  
  # Pattern 1: Replace "./wb.html" with "/wb/wb.html"
  if grep -q '\.\/wb\.html' "$file"; then
    sed -i 's/\.\/wb\.html/\/wb\/wb.html/g' "$file"
    file_changed=true
    ((changes+=$(grep -c '\/wb\/wb.html' "$file")))
  fi
  
  # Pattern 2: Replace "/wb.html" with "/wb/wb.html", but not "/wb/wb.html"
  if grep -q '[^\/]\/wb\.html' "$file"; then
    sed -i 's/\([^\/]\)\/wb\.html/\1\/wb\/wb.html/g' "$file"
    file_changed=true
    ((changes+=$(grep -c '\/wb\/wb.html' "$file")))
  fi
  
  # Pattern 3: Replace "wb.html" with "/wb/wb.html"
  if grep -q '"wb\.html"' "$file"; then
    sed -i 's/"wb\.html"/"\/wb\/wb.html"/g' "$file"
    file_changed=true
    ((changes+=$(grep -c '"\/wb\/wb.html"' "$file")))
  fi
  
  # Pattern 4: Replace request.get('/wb.html') with request.get('/wb/wb.html')
  if grep -q "request\.get(\(['\"]\/wb\.html['\"])" "$file"; then
    sed -i "s/request\.get(\(['\"])\)\/wb\.html\(['\"])\)/request.get(\1\/wb\/wb.html\2)/g" "$file"
    file_changed=true
    ((changes+=$(grep -c "request\.get(" "$file")))
  fi
  
  # Return the number of changes if file was changed, or 0 if no changes
  if [ "$file_changed" = true ]; then
    echo -e "\033[32m✅ Updated $(basename "$file"): $changes references fixed\033[0m"
    return $changes
  else
    # If no changes were made, remove the backup file
    rm "$backup_file"
    return 0
  fi
}

# Process all test files
for file in $(find "$TEST_DIR" -name "*.spec.ts"); do
  changes=0
  update_file "$file"
  changes=$?
  TOTAL_CHANGES=$((TOTAL_CHANGES + changes))
done

echo -e "\n\033[33m🎉 Fix complete! $TOTAL_CHANGES references to wb.html updated across all test files.\033[0m"

# Add entry to fixes.md
FIXES_FILE="./docs/fixes.md"
CURRENT_DATE=$(date +"%Y-%m-%d")

# Create the new fix entry
NEW_FIX="## ${CURRENT_DATE} - Playwright Test Path Fixes

### Changes Made:

1. **Fixed wb.html Path References in Tests**
   - Updated all Playwright tests to use the correct path to wb.html
   - Changed references from \`/wb.html\` and \`./wb.html\` to \`/wb/wb.html\`
   - Fixed request methods to use the correct path
   - Ensured consistency across all test files for better reliability
   - Total of ${TOTAL_CHANGES} path references updated

"

# Insert the new fix at the beginning of the file
echo -e "$NEW_FIX" > "${FIXES_FILE}.tmp"
cat "$FIXES_FILE" >> "${FIXES_FILE}.tmp"
mv "${FIXES_FILE}.tmp" "$FIXES_FILE"

echo -e "\033[32m📝 Updated fixes.md with the changes\033[0m"
