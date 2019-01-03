npm-install-%: ## install specified % npm package
	npm install $* --save-dev
	git add package.json

validate-no-uncommitted-package-lock-changes:
	git diff --exit-code package-lock.json

test:
	npm run test 
