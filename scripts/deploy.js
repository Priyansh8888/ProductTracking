const hre = require("hardhat");
async function main() {
    const ProductTracking = await hre.ethers.getContractFactory("ProductTracking");
    const productTracking = await ProductTracking.deploy();
    await productTracking.waitForDeployment();
    console.log("ProductTracking contract deployed to:",await productTracking.getAddress());
  }
  
  main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
  