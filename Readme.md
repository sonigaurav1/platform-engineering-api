<!-- To start this project -->
1. nvm use
2. npm install
3. npm run husky
4. npm run dev


<!-- To setup a new Node.js project -->
1. npm init -y
2. npm install express husky
3. npm install -D ts-node nodemon tsc-alias prettier typescript @types/express @types/node
4. npm init @eslint/config@latest
5. npx tsc --init

<!-- Add these below lines in scripts section of package.json file  -->
"dev": "nodemon src/app.ts",
"build": "tsc --project tsconfig.json && tsc-alias -p tsconfig.json",
"style:fix": "npm run prettier:fix && npm run prettier:check && npm run lint:fix",
"style:check": "npm run prettier:check && npm run lint",
"lint": "npx eslint src/**/*.ts && echo 'Lint complete.'",
"lint:fix": "npx eslint --fix src/ && echo 'Lint complete.'",
"prettier:fix": "prettier --write src/",
"prettier:check": "prettier --check src/",
"husky": "husky init",
"prepare": "husky"
<!--  -->

<!-- Also add this in package.json file at root level -->
"lint-staged": {
"src/**/*.{js,ts}": [
    "prettier --write --max-warnings=0",
    "prettier --check --max-warnings=0",
    "eslint --fix --max-warnings=0"
]
}
<!--  -->

6. npm run husky

<!-- For development environment run  -->
7. npm run dev
