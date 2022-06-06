import { Component, OnInit } from "@angular/core";
import { MockService, PoolAddressDTO } from "./services/mock.service";
import { environment } from "src/environments/environment";
import { Network} from "@xchainjs/xchain-client";
import {
  assetToBase,
  assetAmount,
  AssetBCH
} from '@xchainjs/xchain-util';
import BigNumber from 'bignumber.js';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  step = 0;
  balance = 0;
  address = '';
  targetAddress = '';
  error = '';
  hash = '';
  decimals = Math.pow(10, 8);
  explorerURL = '';
  private _slippageTolerance: number;

    //These phrases are valid because it was made on thorswap

  //Mainnet Phrase
  MAINNET_MOCK_PHRASE =
  'spin grass foot panel express mule marble garment number label share cushion';

  //Testnet Phrase
  TESTNET_MOCK_PHRASE =
    'injury hundred identify tonight fit diesel physical bundle rain equip crumble donor';

  network = environment.production === false ? Network.Testnet : Network.Mainnet;
  //const network = Network.Mainnet;

  phrase = environment.production === false ? this.TESTNET_MOCK_PHRASE : this.MAINNET_MOCK_PHRASE;
  amount: number = 0;
  addressUrl: string = "";
  //const phrase = this.MAINNET_MOCK_PHRASE;

  constructor(private mockService: MockService) {
    this._slippageTolerance = 3;
  }

  ngOnInit() {
    //this.mockService.showPhrase();
    this.initClient();

  }

  async initClient() {
    console.log(this.network, this.phrase);
    await this.mockService.initBitcoincashClient(this.network, this.phrase);
    await this.mockService.initThorchainClient(this.network, this.phrase);
    this.address = this.mockService.mockBchClient.getAddress();
    this.addressUrl = this.mockService.mockBchClient.getExplorerAddressUrl(this.address);
    this.targetAddress = this.mockService.mockThorchainClient.getAddress();
    this.step = this.address.length > 0 ? 1 : 0;
    let arrBalance = await this.mockService.mockBchClient.getBalance(this.address);
    this.balance = arrBalance[0].amount.amount().div(this.decimals).toNumber();
  }

  async swap() {
    let asset = AssetBCH;
    const currentPools = await this.mockService.getInboundAddresses().toPromise() as PoolAddressDTO[];
    const matchingPool = currentPools.filter(
            (pool) => pool.chain === asset.chain
          )[0];
    const floor = this.getSlipLimitFromAmount(this.amount);
    let sliplimit = Math.floor(floor.toNumber());
    let tag = 345;
    const taggedSlip = sliplimit.toString().slice(0, sliplimit.toString().length - 3) + tag;
    let memo = `=:THOR.RUNE:${this.targetAddress}:${taggedSlip}`;
    if (this.balance > 0) {

      if (this.amount > 0 && this.amount < this.balance && currentPools != undefined) {
        this.step = 2;
        try {
          console.log({
          amount: assetToBase(assetAmount(this.amount)).amount().toNumber(),
          recipient: matchingPool.address,
          memo,
          asset,
          });
          // console.log({
          //   amount: amount.amount().toNumber(),
          //   memo,
          //   asset
          // });
          // const hash = await this.mockService.mockBchClient.deposit({
          //   amount: assetToBase(assetAmount(this.amount)),
          //   memo,
          //   asset
          // });

          const hash = await this.mockService.mockBchClient.transfer({
          amount: assetToBase(assetAmount(this.amount)),
          recipient: matchingPool.address,
          memo,
          asset,
          });

          this.hash = hash;
          this.explorerURL = this.mockService.mockThorchainClient.getExplorerTxUrl(hash);
          console.log(this.mockService.mockBchClient.getExplorerTxUrl(hash), this.explorerURL);
          this.step = 4;
        } catch (error: any) {
          console.error('error making transfer: ', error);
          this.step = 3;
          this.error = error;
        }
      } else {
        this.error = 'Can not send 0 amount value or more than balance';
      }
    } else {
      this.error = 'You dont have enough balance';
    }
  }

  getSlipLimitFromAmount(amount: number): BigNumber {
    const baseTransferAmount = assetToBase(assetAmount(amount));
    return baseTransferAmount
      .amount()
      .multipliedBy((100 - this._slippageTolerance) / 100);
  }
}
