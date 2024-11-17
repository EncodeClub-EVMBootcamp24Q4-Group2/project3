import { expect } from "chai";
import { viem } from "hardhat";

const TEST_RATIO = 100n;
const TEST_PRICE = 10n;
const TEST_EHT_PAYMENT_SIZE = parseEther("10");
const TEST_AMOUNT_TO_BURN = 
describe("NFT Shop", async () => {
  describe("When the Shop contract is deployed", async () => {
async function deployTokenSaleFixture(){
  const publicClient = viem.getPublicClient();
    const token = await viem.deployContract("MyToken");
    const nft = await viem.deployContract("MyNFT");
    const tokenSale = await viem.deployContract ("TokenSale,", [
        TEST_RATIO,
        TEST_PRICE,
        token.address,
        nft.address,
    ]);
    const grantMinterRoleTokenTx = await token.write.grantRole([
      "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
      tokenSale.address,
      ]);
      await (await publicClient).waitForTransactionReceipt({
      hash: grantMinterRoleTokenTx,
      });
    return {tokenSale, token, nft}
}
    it("defines the ratio as provided in parameters", async () => {
      const tokenSale =  await viem.deployContract("TokenSale", [TEST_RATIO, TEST_PRICE]);
      const ratio = await tokenSale.read.ratio();
      expect(ratio).to.equal(TEST_RATIO);
    })
    it("defines the price as provided in parameters", async () => {
      (deployTokenSaleFixture);
      const ratio = await deployTokenSaleFixture.read.price()
    });
    it("uses a valid ERC20 as payment token", async () => {
      throw new Error("Not implemented");
    });
    it("uses a valid ERC721 as NFT collection", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When a user buys an ERC20 from the Token contract", async () => {  
    it("charges the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    })
    it("gives the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When a user burns an ERC20 at the Shop contract", async () => {
    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    })
    it("burns the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When a user buys an NFT from the Shop contract", async () => {
    it("charges the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    })
    it("gives the correct NFT", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When the owner withdraws from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    })
    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});