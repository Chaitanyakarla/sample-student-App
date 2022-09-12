#!/usr/bin/env zsh

ab -n 100 -c 10 \
-H "X-Api-Key: $APIKEY" \
-H "Authorization: Bearer $ACCESSTOKEN" \
"$BENCHMARK_HOST/students/me/successContacts"
