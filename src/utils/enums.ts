import { Transaction } from "@solana/web3.js";
import {
  AccountTrackerConfig,
  AccountTrackerState,
  BaseConfig,
  BaseEmbedControllerState,
  BaseState,
  KeyringControllerState,
  NetworkConfig,
  ProviderConfig,
  TransactionConfig,
  TransactionState,
  UserInfo,
} from "@toruslabs/base-controllers";
import { LOGIN_PROVIDER, OpenloginUserInfo } from "@toruslabs/openlogin";
import {
  SolanaBlock,
  SolanaCurrencyControllerConfig,
  SolanaCurrencyControllerState,
  SolanaPreferencesConfig,
  SolanaPreferencesState,
} from "@toruslabs/solana-controllers";
import { SolanaNetworkState } from "@toruslabs/solana-controllers/dist/types/Network/NetworkController";
import { TokenInfoState, TokensInfoConfig } from "@toruslabs/solana-controllers/dist/types/Tokens/TokenInfoController";
import { TokensTrackerConfig, TokensTrackerState } from "@toruslabs/solana-controllers/dist/types/Tokens/TokensTrackerController";

import MobActivity from "@/assets/mob-activity.svg";
import MobDiscover from "@/assets/mob-discover.svg";
import MobHome from "@/assets/mob-home.svg";
import MobNft from "@/assets/mob-nft.svg";
import MobSettings from "@/assets/mob-settings.svg";

export const LOCAL_STORAGE_KEY = "localStorage";
export const SESSION_STORAGE_KEY = "sessionStorage";
export type STORAGE_TYPE = typeof LOCAL_STORAGE_KEY | typeof SESSION_STORAGE_KEY;
export const FEATURES_DEFAULT_POPUP_WINDOW = "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=1200";

export type OpenLoginPopupResponse = {
  userInfo: OpenloginUserInfo;
  privKey: string;
};

export interface KeyState {
  priv_key: string;
  pub_key: string;
}

export interface OpenLoginBackendState {
  userInfo?: UserInfo;
  publicKey: string;
  privateKey: string;
}

export interface TorusControllerState extends BaseState {
  NetworkControllerState: SolanaNetworkState;
  CurrencyControllerState: SolanaCurrencyControllerState;
  PreferencesControllerState: SolanaPreferencesState;
  AccountTrackerState: AccountTrackerState;
  KeyringControllerState: KeyringControllerState;
  TransactionControllerState: TransactionState<Transaction>;
  EmbedControllerState: BaseEmbedControllerState;
  TokensTrackerState: TokensTrackerState;
  TokenInfoState: TokenInfoState;
  RelayMap: { [relay: string]: string };
  RelayKeyHostMap: { [Pubkey: string]: string };
}

export interface TorusControllerConfig extends BaseConfig {
  NetworkControllerConfig: NetworkConfig;
  CurrencyControllerConfig: SolanaCurrencyControllerConfig;
  PreferencesControllerConfig: SolanaPreferencesConfig;
  AccountTrackerConfig: AccountTrackerConfig<SolanaBlock>;
  KeyringControllerConfig: BaseConfig;
  TransactionControllerConfig: TransactionConfig;
  TokensTrackerConfig: TokensTrackerConfig;
  TokensInfoConfig: TokensInfoConfig;
  RelayHost: { [relay: string]: string };
}

export const CONTROLLER_MODULE_KEY = "controllerModule";

export interface ControllerModuleState {
  torusState: TorusControllerState;
}

export const NAVIGATION_LIST: {
  [key: string]: {
    name: string;
    title: string;
    route: string;
    icon: string;
    mobHidden: boolean;
  };
} = {
  home: {
    name: "navBar.home",
    title: "walletHome.walletHome",
    route: "home",
    icon: MobHome,
    mobHidden: false,
  },
  transfer: {
    name: "navBar.transfer",
    title: "walletTransfer.transferDetails",
    route: "transfer",
    icon: MobHome,
    mobHidden: true,
  },
  topup: {
    name: "navBar.topUp",
    title: "walletTopUp.selectProvider",
    route: "topup",
    icon: MobHome,
    mobHidden: true,
  },
  nfts: {
    name: "navBar.nfts",
    title: "navBar.nfts",
    route: "nfts",
    icon: MobNft,
    mobHidden: false,
  },
  activity: {
    name: "navBar.activity",
    title: "walletActivity.transactionActivities",
    route: "activity",
    icon: MobActivity,
    mobHidden: false,
  },
  settings: {
    name: "navBar.settings",
    title: "walletSettings.settings",
    route: "settings",
    icon: MobSettings,
    mobHidden: false,
  },
  discover: {
    name: "navBar.discover",
    title: "Discover",
    route: "discover",
    icon: MobDiscover,
    mobHidden: false,
  },
};

export const DEFAULT_USER_INFO = {
  aggregateVerifier: "",
  email: "",
  name: "",
  profileImage: "",
  typeOfLogin: LOGIN_PROVIDER.GOOGLE,
  verifier: "",
  verifierId: "",
};

export const SOL = "sol";
export const SNS = "sns";
export const ENS = "ens";
export const GOOGLE = "google";
export const REDDIT = "reddit";
export const DISCORD = "discord";
export const GITHUB = "github";
export const TWITTER = "twitter";

export interface TransferType {
  label: string;
  value: string;
}

export const ALLOWED_VERIFIERS: TransferType[] = [
  {
    label: "Solana address",
    value: SOL,
  },
  {
    label: "SOL Domain",
    value: SNS,
  },
  // {
  //   label: "Twitter handle",
  //   value: TWITTER,
  // },
  // {
  //   label: "Google account",
  //   value: GOOGLE,
  // },
  // {
  //   label: "Reddit username",
  //   value: REDDIT,
  // },
  // {
  //   label: "Discord ID",
  //   value: DISCORD,
  // },
];

export const ALLOWED_VERIFIERS_ERRORS: Record<string, string> = {
  [SOL]: "walletSettings.invalidSol",
  [GOOGLE]: "walletSettings.invalidEmail",
  [REDDIT]: "walletSettings.invalidReddit",
  [DISCORD]: "walletSettings.invalidDiscord",
  [TWITTER]: "walletSettings.invalidTwitter",
  [GITHUB]: "walletSettings.invalidGithub",
  [SNS]: "walletSettings.invalidSns",
};

export const STATUS = {
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  INFO: "info",
} as const;

export type STATUS_TYPE = typeof STATUS[keyof typeof STATUS];

// export type TX_TYPE = "Transfer" | "Deploy" | "Buy Crypto";

export const BUTTON_POSITION = {
  BOTTOM_LEFT: "bottom-left",
  TOP_LEFT: "top-left",
  BOTTOM_RIGHT: "bottom-right",
  TOP_RIGHT: "top-right",
} as const;

export type BUTTON_POSITION_TYPE = typeof BUTTON_POSITION[keyof typeof BUTTON_POSITION];

export interface EmbedInitParams {
  buttonPosition: BUTTON_POSITION_TYPE;
  isIFrameFullScreen: boolean;
  apiKey: string;
  network: ProviderConfig;
  dappMetadata: {
    name: string;
    icon: string;
  };
  extraParams?: { [keyof: string]: string };
}

export type TransactionChannelDataType = {
  type: string;
  message: string | string[];
  messageOnly?: boolean;
  origin: string;
  signer: string;
  balance: string;
  selectedCurrency: string;
  currencyRate: string;
  jwtToken: string;
  network: string;
  networkDetails: ProviderConfig;
};

// export type SignMessageChannelDataType = Omit<TransactionChannelDataType, "message"> & {
export type SignMessageChannelDataType = TransactionChannelDataType & {
  data?: string;
  display?: string;
};

export interface LOGIN_CONFIG {
  loginProvider: string;
  name: string;
  description: string;
  logoHover: string;
  logoLight: string;
  logoDark: string;
  showOnModal: boolean;
  mainOption: boolean;
  showOnDesktop: boolean;
  showOnMobile: boolean;
  hasLightLogo: boolean;
  buttonDescription: string;
}

export enum NFT_CARD_MODE {
  SUMMARY = "summary",
  LARGE = "large",
  EXPANDED = "expanded",
}

export const LOCALE_EN = "en";
export const LOCALE_DE = "de";
export const LOCALE_JA = "ja";
export const LOCALE_KO = "ko";
export const LOCALE_ZH = "zh";
export const LOCALE_ES = "es";
export const LOCALE_EN_LABEL = "English";
export const LOCALE_DE_LABEL = "German (Deutsch)";
export const LOCALE_JA_LABEL = "Japanese (日本語)";
export const LOCALE_KO_LABEL = "Korean (한국어)";
export const LOCALE_ZH_LABEL = "Mandarin (中文)";
export const LOCALE_ES_LABEL = "Spanish (Español)";

export const LOCALES = [
  {
    name: LOCALE_EN_LABEL,
    value: LOCALE_EN,
  },
  {
    name: LOCALE_DE_LABEL,
    value: LOCALE_DE,
  },
  {
    name: LOCALE_JA_LABEL,
    value: LOCALE_JA,
  },
  {
    name: LOCALE_KO_LABEL,
    value: LOCALE_KO,
  },
  {
    name: LOCALE_ZH_LABEL,
    value: LOCALE_ZH,
  },
  {
    name: LOCALE_ES_LABEL,
    value: LOCALE_ES,
  },
];

export const REDIRECT_FLOW_CONFIG: {
  [keyof: string]: { redirectPath: string; requiresLogin: boolean };
} = {
  logout: {
    redirectPath: "/logout",
    requiresLogin: false,
  },
  login: {
    redirectPath: "/login",
    requiresLogin: false,
  },
  wallet_instance_id: {
    redirectPath: "/",
    requiresLogin: true,
  },
  set_provider: {
    redirectPath: "/providerchange",
    requiresLogin: true,
  },
  topup: {
    redirectPath: "/",
    requiresLogin: true,
  },
  get_provider_state: {
    redirectPath: "/",
    requiresLogin: true,
  },
  wallet_get_provider_state: {
    redirectPath: "/",
    requiresLogin: true,
  },
  send_transaction: {
    redirectPath: "/confirm",
    requiresLogin: true,
  },
  sign_transaction: {
    redirectPath: "/confirm",
    requiresLogin: true,
  },
  sign_all_transactions: {
    redirectPath: "/confirm",
    requiresLogin: true,
  },
  sign_message: {
    redirectPath: "/confirm_message",
    requiresLogin: true,
  },
  connect: {
    redirectPath: "/",
    requiresLogin: false,
  },
  user_info: {
    redirectPath: "/",
    requiresLogin: true,
  },
  get_gasless_public_key: {
    redirectPath: "/",
    requiresLogin: true,
  },
  get_accounts: {
    redirectPath: "/",
    requiresLogin: true,
  },
  solana_request_accounts: {
    redirectPath: "/",
    requiresLogin: true,
  },
  spl_transfer: {
    redirectPath: "/confirm_spl",
    requiresLogin: true,
  },
  nft_list: {
    redirectPath: "/",
    requiresLogin: true,
  },
  nft_transfer: {
    redirectPath: "/confirm_nft",
    requiresLogin: true,
  },
};
