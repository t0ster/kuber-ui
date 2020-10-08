#!/usr/bin/env bash
set -euo pipefail

yarn test --ci --reporters=default --reporters=jest-junit --watchAll=false
