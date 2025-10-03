#!/bin/bash

APP_NAME="Variable Tester.app"
APP_PATH="/Applications/$APP_NAME"

echo "=================================="
echo "Variable Tester - Remove Quarantine"
echo "=================================="
echo ""

if [ ! -d "$APP_PATH" ]; then
    echo "❌ Error: $APP_NAME not found in /Applications"
    echo "Please drag the app to /Applications first."
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo "Removing quarantine attribute from $APP_NAME..."
xattr -cr "$APP_PATH"

if [ $? -eq 0 ]; then
    echo "✅ Success! You can now open Variable Tester normally."
else
    echo "❌ Failed to remove quarantine. Try running with sudo:"
    echo "sudo xattr -cr \"$APP_PATH\""
fi

echo ""
read -p "Press Enter to exit..."