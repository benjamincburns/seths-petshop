const Adoption = artifacts.require("Adoption");

contract('Adoption.sol', (accounts) => {

  it ("should allow a user to adopt a pet", async () => {
    let adoption = await Adoption.deployed();

    let receipt = await adoption.alwaysFail(8);

    console.log(require('util').inspect(receipt));
    assert.deepEqual(receipt.status, true)
  });

  /*it ("should return the adopter's address", async () => {
    let adoption = await Adoption.deployed();

    let adopter = await adoption.adopters.call(8);

    assert.deepEqual(adopter.toLowerCase(), accounts[0].toLowerCase());
  });*/
})
