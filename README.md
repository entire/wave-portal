# Wave Portal

This is a demo for learning solidity + hardhat, full-end-to-end demo for FTM and ETH

This project demonstrates a basic Hardhat use case. It comes with a greeter contract (at the moment), a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

- `contracts`: contains solidity contracts
- `frontend`: react frontend
- `scripts`: for running hre scripts
- `test`: self-explanatory
- `hardhat.config.ts`: hardhat config

Make sure you set a `.env` file for setting `WALLET_PRIVATE_KEY` or else deployment will fail.

### Run chain locally
```shell
npx hardhat node
```

### Run tests
```shell
npx hardhat test
```

### Compilation
```shell
npx hardhat compile
```

### Deployment
```shell
npx hardhat run scripts/deploy.js --network rinkeby
npx hardhat run scripts/deploy.js --network fantomOpera
npx hardhat run scripts/deploy.js --network fantomTestnet
```
