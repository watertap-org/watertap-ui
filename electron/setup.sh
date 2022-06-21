#!/usr/bin/env bash

# Install Electron related packages
node install .

# Install the UI (React) related packages
cd ui/
node install .

# Install the REST API backend (FastAPI) related packages
cd ../backend/
pip install -r requirements.txt
