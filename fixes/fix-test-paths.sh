#!/bin/bash

# Comprehensive fix for Playwright test paths
# This script normalizes all paths to wb.html in test files

echo "Normalizing wb.html paths in Playwright tests..."

# Define test directory
TEST_DIR="./Tests/playwright"
TOTAL_CHANGES=0

# Create a timestamp for logs
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
LOG_FILE="test-fix-log-${TIMESTAMP}.txt"
echo "Starting path normalization at $(date)" > $LOG_FILE

# Function to fix a single file
fix_file() {
    local file=$1
    local changes=0
    
    echo "Processing $file" | tee -a $LOG_FILE
    
    # Create a backup
    cp "$file" "${file}.bak"
    
    # Use sed to replace all variations to the correct path
    # First, fix any deeply nested paths
    sed -i 's|/wb/wb/wb/wb/wb/wb.html|/wb/wb.html|g' "$file"
    sed -i 's|/wb/wb/wb/wb/wb.html|/wb/wb.html|g' "$file"
    sed -i 's|/wb/wb/wb/wb.html|/wb/wb.html|g' "$file"
    sed -i 's|/wb/wb/wb.html|/wb/wb.html|g' "$file"
    
    # Then fix paths that are incorrect but not nested
    sed -i 's|/pages/builder/wb.html|/wb/wb.html|g' "$file"
    sed -i 's|./wb.html|/wb/wb.html|g' "$file"
    sed -i 's|"wb.html"|"/wb/wb.html"|g' "$file"
    
    # Fix the case of go directly to root wb.html
    sed -i 's|/wb.html|/wb/wb.html|g' "$file"
    
    # Count differences
    diff_count=$(diff -u "${file}.bak" "$file" | grep -c "^+")
    
    if [ $diff_count -gt 0 ]; then
        echo "  Fixed $diff_count occurrences" | tee -a $LOG_FILE
        changes=$diff_count
    else
        echo "  No changes needed" | tee -a $LOG_FILE
        # Remove backup if no changes
        rm "${file}.bak"
    fi
    
    return $changes
}

# Process all test files
for file in $(find $TEST_DIR -name "*.spec.ts"); do
    fix_file "$file"
    file_changes=$?
    TOTAL_CHANGES=$((TOTAL_CHANGES + file_changes))
done

echo "Total paths fixed: $TOTAL_CHANGES" | tee -a $LOG_FILE

# Update fixes.md with our changes
CURRENT_DATE=$(date +"%Y-%m-%d")
FIXES_ENTRY="## ${CURRENT_DATE} - Playwright Test Path Normalization

### Changes Made:

1. **Normalized wb.html Path References in Tests**
   - Fixed all references to use the standard path: /wb/wb.html
   - Corrected over-nested paths (like /wb/wb/wb/wb.html)
   - Updated old legacy paths (like /pages/builder/wb.html)
   - Total of ${TOTAL_CHANGES} path references normalized
   - Created test path verification script to ensure consistency

"

# Insert entry at the top of fixes.md
echo "$FIXES_ENTRY$(cat docs/fixes.md)" > docs/fixes.md.temp
mv docs/fixes.md.temp docs/fixes.md

echo "Updated docs/fixes.md with the changes" | tee -a $LOG_FILE
echo "Complete log available in $LOG_FILE"
