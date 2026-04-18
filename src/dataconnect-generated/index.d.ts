import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AccountInstruction_Key {
  id: UUIDString;
  __typename?: 'AccountInstruction_Key';
}

export interface AllAccountInstructionsData {
  accountInstructions: ({
    id: UUIDString;
    instructionType: string;
    eventTrigger: string;
    specificInstructions?: string | null;
    accessGrantDuration?: string | null;
    createdAt: TimestampString;
    digitalAccount: {
      name: string;
      accountType: string;
    };
      beneficiary?: {
        firstName: string;
        lastName: string;
      };
  } & AccountInstruction_Key)[];
}

export interface AllBeneficiariesData {
  beneficiaries: ({
    id: UUIDString;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    relationship: string;
    createdAt: TimestampString;
  } & Beneficiary_Key)[];
}

export interface AllDigitalAccountsData {
  digitalAccounts: ({
    id: UUIDString;
    name: string;
    accountType: string;
    url?: string | null;
    username?: string | null;
    passwordHint?: string | null;
    recoveryEmail?: string | null;
    notes?: string | null;
    createdAt: TimestampString;
  } & DigitalAccount_Key)[];
}

export interface AllTrustedAgentsData {
  trustedAgents: ({
    id: UUIDString;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    accessLevel: string;
    designationDate?: TimestampString | null;
    createdAt: TimestampString;
  } & TrustedAgent_Key)[];
}

export interface Beneficiary_Key {
  id: UUIDString;
  __typename?: 'Beneficiary_Key';
}

export interface DigitalAccount_Key {
  id: UUIDString;
  __typename?: 'DigitalAccount_Key';
}

export interface TrustedAgent_Key {
  id: UUIDString;
  __typename?: 'TrustedAgent_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface AllDigitalAccountsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AllDigitalAccountsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AllDigitalAccountsData, undefined>;
  operationName: string;
}
export const allDigitalAccountsRef: AllDigitalAccountsRef;

export function allDigitalAccounts(options?: ExecuteQueryOptions): QueryPromise<AllDigitalAccountsData, undefined>;
export function allDigitalAccounts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AllDigitalAccountsData, undefined>;

interface AllBeneficiariesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AllBeneficiariesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AllBeneficiariesData, undefined>;
  operationName: string;
}
export const allBeneficiariesRef: AllBeneficiariesRef;

export function allBeneficiaries(options?: ExecuteQueryOptions): QueryPromise<AllBeneficiariesData, undefined>;
export function allBeneficiaries(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AllBeneficiariesData, undefined>;

interface AllTrustedAgentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AllTrustedAgentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AllTrustedAgentsData, undefined>;
  operationName: string;
}
export const allTrustedAgentsRef: AllTrustedAgentsRef;

export function allTrustedAgents(options?: ExecuteQueryOptions): QueryPromise<AllTrustedAgentsData, undefined>;
export function allTrustedAgents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AllTrustedAgentsData, undefined>;

interface AllAccountInstructionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AllAccountInstructionsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<AllAccountInstructionsData, undefined>;
  operationName: string;
}
export const allAccountInstructionsRef: AllAccountInstructionsRef;

export function allAccountInstructions(options?: ExecuteQueryOptions): QueryPromise<AllAccountInstructionsData, undefined>;
export function allAccountInstructions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AllAccountInstructionsData, undefined>;

