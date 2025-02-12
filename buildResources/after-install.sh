#!/bin/bash

if [[ "$OSTYPE" == "linux"* ]]; then
    echo "Running post-install steps for Linux..."
    if [ -f "/opt/Resourcify/chrome-sandbox" ]; then
        sudo chown root:root /opt/Resourcify/chrome-sandbox
        sudo chmod 4755 /opt/Resourcify/chrome-sandbox
    fi
fi

exit 0