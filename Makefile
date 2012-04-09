default: help

help:
	@echo "update         - get latest sources"
	@echo "minify         - makes JavaScript download and run faster"
	@echo "server         - starts a fresh server with empty db and blob-store"
	@echo "clean-chrome   - wipes Chrome's locally cached data"
	@echo "test           - runs JavaScript unit tests"

update: update-me update-deps

update-me:
	@git pull

update-deps:
	@git submodule foreach git pull

minify:
	@echo See http://code.google.com/closure/compiler/
	@./res/minimize.sh

server:
	@echo Starting fresh server
	@./res/run_server.sh --wipe

clean-chrome:
	@echo Deleting Chrome LocalStorage, AppCache and FileSystem data
	@./res/clean_chrome.sh

test:
	@echo to be implemented
