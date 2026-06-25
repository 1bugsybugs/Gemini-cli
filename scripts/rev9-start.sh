#!/data/data/com.termux/files/usr/bin/bash

echo "Starting Rev-9 session..."
termux-wake-lock

cd ~/jarvis || {
  echo "Could not enter ~/jarvis"
  exit 1
}

echo
echo "Rev-9 folder:"
pwd

echo
echo "Git status:"
git status -sb

echo
echo "Session started. Wakelock is ON."
echo "Remember: small change, test, commit, push."
