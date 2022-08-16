# @qubit/jest

A jest transform to facilitate testing clientside implementations within the qubit platform

## Q4M usage

1. Install with `npm install --save-dev @qubit/jest jest@^26`
2. Add this to your package.json

```
  "scripts": {
    "test": "jest --coverage"
  },
  "jest": {
    "transform": {
      ".*(.js|.css|.less)$": "@qubit/jest"
    },
    "transformIgnorePatterns": []
  }
```

3. Create a `placement.test.js` file
   You can import the setup tools with `const setup = require('@qubit/jest/setup')`
4. Run your test suite with `npm test`

## Q4CX usage

1. Install with `npm install --save-dev @qubit/jest jest@^26`
2. Add this to your package.json

```
  "scripts": {
    "test": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "transform": {
      ".*(.js|.css|.less)$": "@qubit/jest"
    },
    "transformIgnorePatterns": []
  }
```

3. Create a `triggers.test.js`, `variation-1234.test.js` file
   You can import the setup tools with `const setup = require('@qubit/jest/setup/experience')`
4. Run your test suite with `npm test`

## example

See [test/placement](test/placement) for an example q4m test suite and [test/experience](test/experience) for an example q4cx test suite

<img width="535" alt="Screenshot 2021-04-23 at 16 05 41" src="https://user-images.githubusercontent.com/640611/115893640-5aa47b80-a450-11eb-83dc-3c7e3722c4c2.png">
