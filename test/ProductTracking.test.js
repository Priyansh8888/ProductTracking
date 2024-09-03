const { expect } = require("chai");

describe("ProductTracking Contract", function () {
  let ProductTracking;
  let productTracking;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    ProductTracking = await ethers.getContractFactory("ProductTracking");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a new contract before each test
    productTracking = await ProductTracking.deploy();
    await productTracking.waitForDeployment(); // Use waitForDeployment instead of deployed
  });

  it("Should deploy the contract", async function () {
    // Verify the contract address is a proper address
    expect(await productTracking.getAddress()).to.properAddress;
  });

  it("Should create a product", async function () {
    // Create a product with some details
    await productTracking.createProduct("Product1", "Description1");
    
    // Retrieve the product details
    const product = await productTracking.products(1);
    
    // Check if the product details are correct
    expect(product.name).to.equal("Product1");
    expect(product.description).to.equal("Description1");
    expect(product.owner).to.equal(owner.address);
    expect(product.state).to.equal(0); // State.Created (which is 0)
  });

  it("Should update product state", async function () {
    // Create a product first
    await productTracking.createProduct("Product2", "Description2");
    
    // Update the product state
    await productTracking.updateState(1, 3); // State.Shipped (which is 3)
    
    // Retrieve the updated product details
    const product = await productTracking.products(1);
    
    // Check if the state was updated correctly
    expect(product.state).to.equal(3); // State.Shipped
  });

  it("Should transfer ownership of the product", async function () {
    // Create a product first
    await productTracking.createProduct("Product3", "Description3");

    // Transfer ownership from owner to addr1
    await productTracking.transferOwnership(1, addr1.address);

    // Retrieve the product details
    const product = await productTracking.products(1);

    // Check if the ownership was transferred correctly
    expect(product.owner).to.equal(addr1.address);
  });

  it("Should fail to transfer ownership if not the owner", async function () {
    // Create a product first
    await productTracking.createProduct("Product4", "Description4");

    // Try to transfer ownership from addr1 (not the owner) to addr2
    await expect(
      productTracking.connect(addr1).transferOwnership(1, addr2.address)
    ).to.be.revertedWith("Only the owner can transfer ownership");

    // Retrieve the product details
    const product = await productTracking.products(1);

    // Check if the ownership has not changed
    expect(product.owner).to.equal(owner.address); // Ownership should still belong to the original owner
  });

  // Add more tests as needed for other functionalities
});
