import { AllDigitalAccountsData, AllBeneficiariesData, AllTrustedAgentsData, AllAccountInstructionsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAllDigitalAccounts(options?: useDataConnectQueryOptions<AllDigitalAccountsData>): UseDataConnectQueryResult<AllDigitalAccountsData, undefined>;
export function useAllDigitalAccounts(dc: DataConnect, options?: useDataConnectQueryOptions<AllDigitalAccountsData>): UseDataConnectQueryResult<AllDigitalAccountsData, undefined>;

export function useAllBeneficiaries(options?: useDataConnectQueryOptions<AllBeneficiariesData>): UseDataConnectQueryResult<AllBeneficiariesData, undefined>;
export function useAllBeneficiaries(dc: DataConnect, options?: useDataConnectQueryOptions<AllBeneficiariesData>): UseDataConnectQueryResult<AllBeneficiariesData, undefined>;

export function useAllTrustedAgents(options?: useDataConnectQueryOptions<AllTrustedAgentsData>): UseDataConnectQueryResult<AllTrustedAgentsData, undefined>;
export function useAllTrustedAgents(dc: DataConnect, options?: useDataConnectQueryOptions<AllTrustedAgentsData>): UseDataConnectQueryResult<AllTrustedAgentsData, undefined>;

export function useAllAccountInstructions(options?: useDataConnectQueryOptions<AllAccountInstructionsData>): UseDataConnectQueryResult<AllAccountInstructionsData, undefined>;
export function useAllAccountInstructions(dc: DataConnect, options?: useDataConnectQueryOptions<AllAccountInstructionsData>): UseDataConnectQueryResult<AllAccountInstructionsData, undefined>;
