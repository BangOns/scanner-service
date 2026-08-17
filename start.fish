#!/usr/bin/env fish
# ========================================================
# Scanner Agent - Fish Shell Quick Runner
# ========================================================
cd (status dirname)
echo "========================================================"
echo " Starting Scanner Agent on Linux/macOS (Fish Shell)..."
echo " Listening on http://127.0.0.1:2019"
echo "========================================================"
node service.js
