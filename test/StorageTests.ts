import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Storage", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {

    const TS = await ethers.getContractFactory("TrustlessEscrow_Test");
    // random addresses
    const test = await TS.deploy("0xAf2358e98683265cBd3a48509123d390dDf54534", "0x473d3a2005499301Dc353AFa9D0C9c5980b5188c", "0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5","0x5e69b3131971Aed9C78e6Cb9B5b428b4c603A544");

    return { test };
  }

  describe("Addresses", function () {
    it("user1", async function () {
        const { test } = await loadFixture(
          deployOneYearLockFixture
        );

        expect(await test.getUser1()).to.be.equal("0xAf2358e98683265cBd3a48509123d390dDf54534");
      });

      it("user2", async function () {
        const { test } = await loadFixture(
          deployOneYearLockFixture
        );

        expect(await test.getUser2()).to.be.equal("0x473d3a2005499301Dc353AFa9D0C9c5980b5188c");
      });

      it("address1", async function () {
        const { test } = await loadFixture(
          deployOneYearLockFixture
        );

        expect(await test.getAddress1()).to.be.equal("0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5");
      });

      it("address2", async function () {
        const { test } = await loadFixture(
          deployOneYearLockFixture
        );

        expect(await test.getAddress2()).to.be.equal("0x5e69b3131971Aed9C78e6Cb9B5b428b4c603A544");
      });

      it("confirmations", async function () {
        const { test } = await loadFixture(
          deployOneYearLockFixture
        );
        // await test.logAll()
        expect(await test.getConfirmations()).to.be.equal("0x0000");
      });

      it("change", async function () {
        const { test } = await loadFixture(
            deployOneYearLockFixture
        );
        await test.change()
        expect(await test.getConfirmations()).to.be.equal("0x0101");
      })
    });
  });
