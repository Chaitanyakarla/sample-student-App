#!/usr/bin/env zsh

# Just execute a single specific request so that a hooman can review the 
# results and ensure it looks good, e.g. access token is valid, host is up
echo 'Performing single request ...'
ab -n 1 -c 1 -v 3 \
-H "X-Api-Key: $APIKEY" \
-H "Authorization: Bearer $ACCESSTOKEN" \
"$BENCHMARK_HOST/students/me/profile"

# Just a baseline for apache bench ... feel free to tinker
numTotalRequests=100
numConcurrentRequests=10

echo '  ******************************************* '
echo 'Does everything look good above for running full test (y/N)?'

read continue

if [ $continue = 'y' ]; then

    if [ ! -d "./out" ]; then
        mkdir "./out"
    fi

    echo
    echo
    echo '========================================================='
    echo '*********** Beginning full benchmark analysis ***********'
    echo '========================================================='
    echo     
    echo "Test Parameters:"
    echo '---------------------------------------------------------'
    echo "API Host: $BENCHMARK_HOST"
    echo "Total Requests: $numTotalRequests"
    echo "Concurrent Requests: $numConcurrentRequests"
    echo ''
    echo 'Testing Student Profile ...'
    ab -n $numTotalRequests -c $numConcurrentRequests \
    -H "X-Api-Key: $APIKEY" \
    -H "Authorization: Bearer $ACCESSTOKEN" \
    "$BENCHMARK_HOST/students/me/profile" > out/profile.txt
    
    echo '---------------------------------------------------------'
    grep "Server Hostname" out/profile.txt
    grep "Document Path" out/profile.txt
    grep "Time per request" out/profile.txt

    echo
    echo 'Testing Success Contacts ...'
    ab -n $numTotalRequests -c $numConcurrentRequests \
    -H "X-Api-Key: $APIKEY" \
    -H "Authorization: Bearer $ACCESSTOKEN" \
    "$BENCHMARK_HOST/students/me/successContacts" > out/success-contacts.txt
    
    echo '---------------------------------------------------------'
    grep "Server Hostname" out/success-contacts.txt
    grep "Document Path" out/success-contacts.txt
    grep "Time per request" out/success-contacts.txt

    echo
    echo 'Testing Student Tasks ...'
    ab -n $numTotalRequests -c $numConcurrentRequests \
    -H "X-Api-Key: $APIKEY" \
    -H "Authorization: Bearer $ACCESSTOKEN" \
    "$BENCHMARK_HOST/students/me/tasks" > out/tasks.txt
    
    echo '---------------------------------------------------------'
    grep "Server Hostname" out/tasks.txt
    grep "Document Path" out/tasks.txt
    grep "Time per request" out/tasks.txt

    echo
    echo 'Testing Course List ...'
    ab -n $numTotalRequests -c $numConcurrentRequests \
    -H "X-Api-Key: $APIKEY" \
    -H "Authorization: Bearer $ACCESSTOKEN" \
    "$BENCHMARK_HOST/students/me/academicTerms?includeCourseSections=true" > out/courses.txt
    
    echo '---------------------------------------------------------'
    grep "Server Hostname" out/courses.txt
    grep "Document Path" out/courses.txt
    grep "Time per request" out/courses.txt

    echo
    echo 'Testing Academic Terms ...'
    ab -n $numTotalRequests -c $numConcurrentRequests \
    -H "X-Api-Key: $APIKEY" \
    -H "Authorization: Bearer $ACCESSTOKEN" \
    "$BENCHMARK_HOST/students/me/academicTerms" > out/academic-terms.txt
    
    echo '---------------------------------------------------------'
    grep "Server Hostname" out/academic-terms.txt
    grep "Document Path" out/academic-terms.txt
    grep "Time per request" out/academic-terms.txt

    echo
    echo 'Complete!' 
fi