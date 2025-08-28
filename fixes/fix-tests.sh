#!/bin/bash

# Find and replace occurrences of incorrect wb.html paths in test files

echo "Fixing Playwright test paths for wb.html..."

# Directory containing test files
TEST_DIR="./Tests/playwright"

# Count changes
TOTAL_CHANGES=0

# Process each test file
for file in $(find "$TEST_DIR" -name "*.spec.ts"); do
  echo "Processing $file"
  
  # Create backup file
  cp "$file" "$file.bak"
  
  # Replace various patterns of wb.html references
  sed -i 's|"/wb.html"|"/wb/wb.html"|g' "$file"
  sed -i "s|'/wb.html'|'/wb/wb.html'|g" "$file"
  sed -i 's|"./wb.html"|"/wb/wb.html"|g' "$file"
  sed -i "s|'./wb.html'|'/wb/wb.html'|g" "$file"
  sed -i 's|goto("/wb.html"|goto("/wb/wb.html"|g' "$file"
  sed -i "s|goto('/wb.html'|goto('/wb/wb.html'|g" "$file"
  sed -i 's|"wb.html"|"/wb/wb.html"|g' "$file"
  
  # Count changes
  DIFF_COUNT=$(diff -U0 "$file.bak" "$file" | grep -c ^+)
  echo "Made $DIFF_COUNT changes in $file"
  TOTAL_CHANGES=$((TOTAL_CHANGES + DIFF_COUNT))
done

echo "Total changes made: $TOTAL_CHANGES"

# Add an entry to fixes.md
CURRENT_DATE=$(date +"%Y-%m-%d")
FIXES_ENTRY="## $CURRENT_DATE - Test Path Fixes

### Changes Made:

1. **Fixed wb.html Path References in Tests**
   - Updated all Playwright tests to use the correct path to wb.html (/wb/wb.html)
   - Total of $TOTAL_CHANGES path references updated
   - Ensured consistency across all test files

"

# Insert at the beginning of fixes.md
echo "$FIXES_ENTRY$(cat docs/fixes.md)" > docs/fixes.md.temp
mv docs/fixes.md.temp docs/fixes.md

echo "Updated docs/fixes.md with the changes"
