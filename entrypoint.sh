#/bin/sh

set -e

if [ -z "$MONGOHOST" ]; then
  echo "Please pass env variable MONGOHOST"
  exit 1
fi

################
# Run one file at a time using system grep
# This was slow because it had to check in mongo each file on its own to skip or not
# The -d implementation below just skips the whole bunch of files that are in mongo,
# and hence is faster
################
# get xargs to exit on first failure
# http://stackoverflow.com/a/26485626/4126114
# Note that swift2json already exits with code 255
# cd /usr/share/swift
# grep -l "FIN 103" *txt|xargs -n 1 swift2json -m "$MONGOHOST" -f

#######################
# run on a directory and skip in one step all files that are already in mongo
#################
swift2json -d /usr/share/swift -m "$MONGOHOST" -f
