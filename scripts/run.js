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

    // get current wave count
    let waveCount;
    waveCount = await waveContract.connect(owner).getTotalWaves();
    console.log("current wave count number: ", waveCount.toNumber());

    // call first wave
    let waveTxn = await waveContract.connect(owner).wave('a message!');
    await waveTxn.wait() // wait for transaction to be mined

    // call some another wave
    waveTxn = await waveContract.connect(owner).wave('another message! from random person');
    await waveTxn.wait() // wait for transaction to be mined

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
