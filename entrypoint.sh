#/bin/sh

set -e

if [ -z "$MONGOHOST" ]; then
  echo "Please pass env variable MONGOHOST"
  exit 1
fi

# get xargs to exit on first failure
# http://stackoverflow.com/a/26485626/4126114
# Note that swift2json already exits with code 255
cd /usr/share/swift
grep -l "FIN 103" *txt|xargs -n 1 swift2json -m "$MONGOHOST" -f
