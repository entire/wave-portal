const main = async () => {
    // setup and deploy contract
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
      value: hre.ethers.utils.parseEther('0.1'),
    });
    await waveContract.deployed();
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address,
    );

    // print contract address and balance
    console.log("Contract address is:", waveContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    // get signer
    const [owner, randomPerson] = await hre.ethers.getSigners();
    console.log("Contract deployed by:", owner.address);

    // try two waves
    const opts = { gasPrice: 300000, gasLimit: 85000, nonce: 5, value: 0 };
    const waveTxn = await waveContract.connect(owner).wave('wave #1', opts);
    await waveTxn.wait() // wait for transaction to be mined
    console.log("first wave finished");
    const waveTxn2 = await waveContract.connect(randomPerson).wave('wave #2', opts);
    await waveTxn2.wait() // wait for transaction to be mined
    console.log("second wave finished");

    // get contract balance to see what happened
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Latest Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    // get all waves
    let allWaves = await waveContract.connect(owner).getAllWaves();
    console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

};

runMain();
