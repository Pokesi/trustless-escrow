import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256 } from "@ethersproject/keccak256";

const USER1 = "0xAf2358e98683265cBd3a48509123d390dDf54534";
const USER2 = "0x473d3a2005499301Dc353AFa9D0C9c5980b5188c";
const abi = ethers.utils.defaultAbiCoder;

describe("Router", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function fixture() {
    const [owner] = await ethers.getSigners();
    const TR = await ethers.getContractFactory("TrustlessRouter");
    // random addresses
    const router = await TR.deploy();

    const ERC20 = await ethers.getContractFactory("ERC20");
    const token1 = await ERC20.deploy("Hello", "HI");
    const token2 = await ERC20.deploy("Hello", "HI");

    const ERC721 = await ethers.getContractFactory("ERC721");
    const nft1 = await ERC721.deploy("HELLO", "HI");
    const nft2 = await ERC721.deploy("HELLO", "HI");

    const signer = TR.getDeployTransaction().from;
    return { router, token1, token2, nft1, nft2, owner: owner.address };
  }

  describe("ERC20 Tests", function () {
    it("confirm", async function () {
        const { router, token1, token2, owner } = await loadFixture(
          fixture
        );

        await router.create20(USER1, owner, token1.address, token2.address, 60 * 60 * 60 * 24);
        const escrow = await router.escrows(keccak256(abi.encode(
          ["address", "address"],
          [USER1, owner]
        )));

        const contract = await ethers.getContractAt("TrustlessEscrowERC20", escrow);
        await contract.confirm();

        const confirmations = await contract.confirmations()

        expect(confirmations).to.be.equal("0x0001");
    });

    it("sld not work with < 2 confirmations", async function () {
      const { router, token1, token2, owner } = await loadFixture(
        fixture
      );

      await router.create20(USER1, owner, token1.address, token2.address, 60 * 60 * 60 * 24);
      const escrow = await router.escrows(keccak256(abi.encode(
        ["address", "address"],
        [USER1, owner]
      )));

      const contract = await ethers.getContractAt("TrustlessEscrowERC20", escrow);
      await expect(contract.execute()).to.be.reverted;

      await contract.confirm();
      await expect(contract.execute()).to.be.reverted;
    });

    it("revert if cancel is called before time is done", async function () {
      const { router, token1, token2, owner } = await loadFixture(
        fixture
      );

      await router.create20(USER1, owner, token1.address, token2.address, 60 * 60 * 60 * 24);
      const escrow = await router.escrows(keccak256(abi.encode(
        ["address", "address"],
        [USER1, owner]
      )));

      const contract = await ethers.getContractAt("TrustlessEscrowERC20", escrow);
      await expect(contract.cancel()).to.be.reverted;

      await time.increase(60 * 60 * 60 * 24 + 10);

      await expect(contract.cancel()).to.not.be.reverted;
    });

    // The others implement the **exact** same logic so no need to test
  });
});
