#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_SRC="$DIR/PressZero.app"
APP_DEST="/Applications/PressZero.app"

echo "=========================================================="
echo " PressZero for macOS — One-Click Universal Installer"
echo "=========================================================="

if [ ! -d "$APP_SRC" ]; then
    echo "Error: PressZero.app not found in $DIR"
    exit 1
fi

echo "Installing PressZero.app to /Applications..."
rm -rf "$APP_DEST"
cp -R "$APP_SRC" "/Applications/"
xattr -cr "$APP_DEST" 2>/dev/null

echo "✓ Successfully installed PressZero to /Applications!"
echo "Launching PressZero..."
open -a "$APP_DEST"
exit 0