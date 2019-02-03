#!/bin/bash

# join is deprecated
#coffee -b --join ../hw.js -c *.coffee

cat *.coffee | coffee --bare --compile --stdio > ../hw.js

