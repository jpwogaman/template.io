@REM xargs will only work in CMD prompt if <path\to\Git\usr\bin> is in your PATH

git ls-files | grep -i -ve "\.lock\|\lock.yaml\|\.woff\|\.png\|\.jpg\|\.jpeg\|\.gif\|\.cpr\|\.ico\|\.icns" | grep -v "^assets/.*\.\(json\|xml\|state\)$" | grep -v "^src-tauri\/gen\/schemas/.*\.json$"| xargs wc -l