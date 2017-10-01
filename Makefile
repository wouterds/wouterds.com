default: build

clean:
	-rm -rf ./.version
	-rm -rf ./node_modules
	-rm -rf ./vendor

build:
	-git describe --abbrev=0 --tags > ./.version
	-git rev-list --tags --max-count=1 >> ./.version
