#!/data/data/com.termux/files/usr/bin/bash

echo "Ending Rev-9 session..."

cd ~/jarvis || {
  echo "Could not enter ~/jarvis"
  termux-wake-unlock
  exit 1
}

echo
echo "Git status:"
git status -sb

echo
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "Working tree clean. Safe to end session."
else
  echo "You still have uncommitted or untracked changes."
  echo "Review them before closing Termux:"
  echo "  git status"
  echo "  git add <files>"
  echo "  git commit -m \"your message\""
  echo "  git push"
fi

echo
termux-wake-unlock
echo "Wakelock is OFF."
