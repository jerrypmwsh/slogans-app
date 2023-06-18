deploy: build
	npm run deploy

.PHONY: build
build:
	npm run build

.PHONY: local
local:
	npm run dev