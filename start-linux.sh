#!/usr/bin/env bash
# ========================================================
# Scanner Agent - Linux / macOS Quick Runner
# ========================================================
cd "$(dirname "$0")"
echo "========================================================"
echo " Starting Scanner Agent on Linux/macOS..."
echo " Listening on http://127.0.0.1:2019"
echo "========================================================"
node service.js
