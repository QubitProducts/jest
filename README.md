# @qubit/jest

A jest transform to facilitate testing clientside implementations within the qubit platform

## usage

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

3. Create a `test/placement.test.js` file
   You can import the setup tools with `const setup = require('@qubit/jest/setup')`
4. Run your test suite with `npm test`

## example

See [test/placement.test.js](test/placement.test.js) for an example test suite

<img width="535" alt="Screenshot 2021-04-23 at 16 05 41" src="https://user-images.githubusercontent.com/640611/115893640-5aa47b80-a450-11eb-83dc-3c7e3722c4c2.png">
