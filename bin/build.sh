#!/bin/bash
electron-packager . 'tracer gallery' --platform=darwin --out=bundles --overwrite --icon="./assets/icon/tracer gallery - 1024.icns" 
open ./bundles

