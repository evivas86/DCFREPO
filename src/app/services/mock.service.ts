import { Injectable } from "@angular/core";
import { Client as binanceClient } from '@xchainjs/xchain-binance';
import { Client as bitcoinClient, ClientUrl } from '@xchainjs/xchain-bitcoin';
import { Client as thorchainClient, getChainIds, getDefaultClientUrl, ChainIds } from '@xchainjs/xchain-thorchain'
import { Client as litecoinClient } from '@xchainjs/xchain-litecoin';
import { Client as bitcoinCashClient } from '@xchainjs/xchain-bitcoincash';
import { Client as ethereumClient,  } from '@xchainjs/xchain-ethereum/lib';
import { Client as dogeClient } from '@xchainjs/xchain-doge';
import { Client as terraClient } from '@xchainjs/xchain-terra';
import { generatePhrase, validatePhrase} from "@xchainjs/xchain-crypto";
import { environment } from "src/environments/environment";
import { Network } from "@xchainjs/xchain-client";

@Injectable({
  providedIn: "root"
})
export class MockService {

  mockBinanceClient: binanceClient;
  mockBtcClient: bitcoinClient;
  mockThorchainClient: thorchainClient;
  mockEthereumClient: ethereumClient;
  mockLtcClient: litecoinClient;
  mockBchClient: bitcoinCashClient;
  mockDogeClient: dogeClient;
  mockTerraClient: terraClient;

  //These phrases are valid because it was made on thorswap
  
  //Mainnet Phrase
  MAINNET_MOCK_PHRASE =
  'spin grass foot panel express mule marble garment number label share cushion';

  //Testnet Phrase
  TESTNET_MOCK_PHRASE =
  'injury hundred identify tonight fit diesel physical bundle rain equip crumble donor';
  

  constructor() {

    const network = environment.production === false ? Network.Testnet : Network.Mainnet;
    //const network = Network.Mainnet;

    const phrase = environment.production === false ? this.TESTNET_MOCK_PHRASE : this.MAINNET_MOCK_PHRASE;
    //const phrase = this.MAINNET_MOCK_PHRASE;

    //None of these clients can be initialized because throws the Invalid Phrase Error on browser

    this.initThorchainClient(network,phrase);
    this.initBinanceClient(network,phrase);
    this.initBitcoinClient(network,phrase);
    this.initBitcoincashClient(network,phrase);
    this.initDogecoinClient(network,phrase);
    this.initEthereumClient(network,phrase);
    this.initLitecoinClient(network,phrase);
    this.initTerraClient(network,phrase);

  }

  public showPhrase() {
    const phrase = generatePhrase();
    console.log(`Phrase is valid: ${validatePhrase(phrase)}`, phrase);
  }

  public async initThorchainClient(network: Network,phrase: string){
    const chainIds = await this.setChainIds();
    this.mockThorchainClient = new thorchainClient({
      network,
      phrase,
      chainIds,
    });
   console.log(this.mockThorchainClient.getAddress());
  }

  public async setChainIds(): Promise<ChainIds>{
    const chainIds = await getChainIds(getDefaultClientUrl());
    return chainIds;
  }

  public async initBinanceClient(network: Network,phrase: string){
    this.mockBinanceClient = new binanceClient({
      network: network,
      phrase: phrase,
    });
   console.log(this.mockBinanceClient.getAddress());
  }

  public async initBitcoinClient(network: Network,phrase: string){
    const haskoinClientUrl: ClientUrl = {
      mainnet: 'https://haskoin.ninerealms.com/btc',
      stagenet: 'https://haskoin.ninerealms.com/btc',
      testnet: 'https://haskoin.ninerealms.com/btctest',
    };
    this.mockBtcClient = new bitcoinClient({
       network,
       phrase,
       sochainUrl: 'https://sochain.com/api/v2',
       haskoinUrl: haskoinClientUrl,
    });
   console.log(this.mockBtcClient.getAddress());
  }

  public async initBitcoincashClient(network: Network,phrase: string){
    this.mockBchClient = new bitcoinCashClient({ network, phrase });
   console.log(this.mockBchClient.getAddress());
  }
  
  public async initDogecoinClient(network: Network,phrase: string){
    this.mockDogeClient = new dogeClient({ network, phrase });
   console.log(this.mockDogeClient.getAddress());
  }

  public async initLitecoinClient(network: Network,phrase: string){
    this.mockLtcClient = new litecoinClient({ network, phrase });
   console.log(this.mockLtcClient.getAddress());
  }

  public async initTerraClient(network: Network,phrase: string){
    this.mockTerraClient = new terraClient({ network, phrase });
   console.log(this.mockTerraClient.getAddress());
  }

  public async initEthereumClient(network: Network,phrase: string){
     this.mockEthereumClient = new ethereumClient({
       network,
       phrase,
       etherscanApiKey: environment.etherscanKey,
       infuraCreds: { projectId: environment.infuraProjectId as string },
     });
   console.log(this.mockEthereumClient.getAddress());
  }
}
