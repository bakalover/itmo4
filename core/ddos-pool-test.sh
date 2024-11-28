#!/bin/bash

run_curl() {
    while true; do
        curl -k -X GET https://localhost:35443/routes
    done
}

for i in {1..8}; do
    run_curl &
done

pids=($(jobs -p))

sleep 10

# Kill all background jobs
for pid in "${pids[@]}"; do
    kill "$pid"
done

# Wait for all background jobs to finish
wait

echo "Done"
