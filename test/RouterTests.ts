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
    return { router, token1, token2, owner: owner.address };
  }

  describe("Create", function () {
    it("ERC20", async function () {
        const { router, token1, token2, owner } = await loadFixture(
          fixture
        );

        await router.create20(USER1, owner, token1.address, token2.address, 60 * 60 * 60 * 24);

        expect(await router.escrows(keccak256(abi.encode(
          ["address", "address"],
          [USER1, owner]
        )))).is.not.equal("0x0000000000000000000000000000000000000000");
    });

    // The other's implement the **exact** same logic so no need to test
  });
});
