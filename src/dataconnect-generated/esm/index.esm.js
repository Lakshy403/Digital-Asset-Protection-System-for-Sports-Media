import { queryRef, executeQuery, validateArgsWithOptions, validateArgs, makeMemoryCacheProvider } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'digital-asset-protection',
  location: 'us-east1'
};
export const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
export const allDigitalAccountsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AllDigitalAccounts');
}
allDigitalAccountsRef.operationName = 'AllDigitalAccounts';

export function allDigitalAccounts(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(allDigitalAccountsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const allBeneficiariesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AllBeneficiaries');
}
allBeneficiariesRef.operationName = 'AllBeneficiaries';

export function allBeneficiaries(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(allBeneficiariesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const allTrustedAgentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AllTrustedAgents');
}
allTrustedAgentsRef.operationName = 'AllTrustedAgents';

export function allTrustedAgents(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(allTrustedAgentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

export const allAccountInstructionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AllAccountInstructions');
}
allAccountInstructionsRef.operationName = 'AllAccountInstructions';

export function allAccountInstructions(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(allAccountInstructionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}

