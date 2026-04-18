const { queryRef, executeQuery, validateArgsWithOptions, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'digital-asset-protection',
  location: 'us-east1'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const allDigitalAccountsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AllDigitalAccounts');
}
allDigitalAccountsRef.operationName = 'AllDigitalAccounts';
exports.allDigitalAccountsRef = allDigitalAccountsRef;

exports.allDigitalAccounts = function allDigitalAccounts(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(allDigitalAccountsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const allBeneficiariesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AllBeneficiaries');
}
allBeneficiariesRef.operationName = 'AllBeneficiaries';
exports.allBeneficiariesRef = allBeneficiariesRef;

exports.allBeneficiaries = function allBeneficiaries(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(allBeneficiariesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const allTrustedAgentsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AllTrustedAgents');
}
allTrustedAgentsRef.operationName = 'AllTrustedAgents';
exports.allTrustedAgentsRef = allTrustedAgentsRef;

exports.allTrustedAgents = function allTrustedAgents(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(allTrustedAgentsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const allAccountInstructionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AllAccountInstructions');
}
allAccountInstructionsRef.operationName = 'AllAccountInstructions';
exports.allAccountInstructionsRef = allAccountInstructionsRef;

exports.allAccountInstructions = function allAccountInstructions(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(allAccountInstructionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
