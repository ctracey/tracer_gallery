#!/bin/bash
sudo find /private/var/folders/ -name 'com.apple.dock.iconcache' -delete
sudo find /private/var/folders/ -name 'com.apple.iconservices' -delete
sudo rm -r /Library/Caches/com.apple.iconservices.store
