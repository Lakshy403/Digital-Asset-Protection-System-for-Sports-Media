# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*AllDigitalAccounts*](#alldigitalaccounts)
  - [*AllBeneficiaries*](#allbeneficiaries)
  - [*AllTrustedAgents*](#alltrustedagents)
  - [*AllAccountInstructions*](#allaccountinstructions)
- [**Mutations**](#mutations)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## AllDigitalAccounts
You can execute the `AllDigitalAccounts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
allDigitalAccounts(options?: ExecuteQueryOptions): QueryPromise<AllDigitalAccountsData, undefined>;

interface AllDigitalAccountsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AllDigitalAccountsData, undefined>;
}
export const allDigitalAccountsRef: AllDigitalAccountsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
allDigitalAccounts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AllDigitalAccountsData, undefined>;

interface AllDigitalAccountsRef {
  ...
  (dc: DataConnect): QueryRef<AllDigitalAccountsData, undefined>;
}
export const allDigitalAccountsRef: AllDigitalAccountsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the allDigitalAccountsRef:
```typescript
const name = allDigitalAccountsRef.operationName;
console.log(name);
```

### Variables
The `AllDigitalAccounts` query has no variables.
### Return Type
Recall that executing the `AllDigitalAccounts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AllDigitalAccountsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AllDigitalAccounts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, allDigitalAccounts } from '@dataconnect/generated';


// Call the `allDigitalAccounts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await allDigitalAccounts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await allDigitalAccounts(dataConnect);

console.log(data.digitalAccounts);

// Or, you can use the `Promise` API.
allDigitalAccounts().then((response) => {
  const data = response.data;
  console.log(data.digitalAccounts);
});
```

### Using `AllDigitalAccounts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, allDigitalAccountsRef } from '@dataconnect/generated';


// Call the `allDigitalAccountsRef()` function to get a reference to the query.
const ref = allDigitalAccountsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = allDigitalAccountsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.digitalAccounts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.digitalAccounts);
});
```

## AllBeneficiaries
You can execute the `AllBeneficiaries` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
allBeneficiaries(options?: ExecuteQueryOptions): QueryPromise<AllBeneficiariesData, undefined>;

interface AllBeneficiariesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AllBeneficiariesData, undefined>;
}
export const allBeneficiariesRef: AllBeneficiariesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
allBeneficiaries(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AllBeneficiariesData, undefined>;

interface AllBeneficiariesRef {
  ...
  (dc: DataConnect): QueryRef<AllBeneficiariesData, undefined>;
}
export const allBeneficiariesRef: AllBeneficiariesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the allBeneficiariesRef:
```typescript
const name = allBeneficiariesRef.operationName;
console.log(name);
```

### Variables
The `AllBeneficiaries` query has no variables.
### Return Type
Recall that executing the `AllBeneficiaries` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AllBeneficiariesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AllBeneficiaries`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, allBeneficiaries } from '@dataconnect/generated';


// Call the `allBeneficiaries()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await allBeneficiaries();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await allBeneficiaries(dataConnect);

console.log(data.beneficiaries);

// Or, you can use the `Promise` API.
allBeneficiaries().then((response) => {
  const data = response.data;
  console.log(data.beneficiaries);
});
```

### Using `AllBeneficiaries`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, allBeneficiariesRef } from '@dataconnect/generated';


// Call the `allBeneficiariesRef()` function to get a reference to the query.
const ref = allBeneficiariesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = allBeneficiariesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.beneficiaries);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.beneficiaries);
});
```

## AllTrustedAgents
You can execute the `AllTrustedAgents` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
allTrustedAgents(options?: ExecuteQueryOptions): QueryPromise<AllTrustedAgentsData, undefined>;

interface AllTrustedAgentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AllTrustedAgentsData, undefined>;
}
export const allTrustedAgentsRef: AllTrustedAgentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
allTrustedAgents(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AllTrustedAgentsData, undefined>;

interface AllTrustedAgentsRef {
  ...
  (dc: DataConnect): QueryRef<AllTrustedAgentsData, undefined>;
}
export const allTrustedAgentsRef: AllTrustedAgentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the allTrustedAgentsRef:
```typescript
const name = allTrustedAgentsRef.operationName;
console.log(name);
```

### Variables
The `AllTrustedAgents` query has no variables.
### Return Type
Recall that executing the `AllTrustedAgents` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AllTrustedAgentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AllTrustedAgents`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, allTrustedAgents } from '@dataconnect/generated';


// Call the `allTrustedAgents()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await allTrustedAgents();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await allTrustedAgents(dataConnect);

console.log(data.trustedAgents);

// Or, you can use the `Promise` API.
allTrustedAgents().then((response) => {
  const data = response.data;
  console.log(data.trustedAgents);
});
```

### Using `AllTrustedAgents`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, allTrustedAgentsRef } from '@dataconnect/generated';


// Call the `allTrustedAgentsRef()` function to get a reference to the query.
const ref = allTrustedAgentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = allTrustedAgentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.trustedAgents);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.trustedAgents);
});
```

## AllAccountInstructions
You can execute the `AllAccountInstructions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
allAccountInstructions(options?: ExecuteQueryOptions): QueryPromise<AllAccountInstructionsData, undefined>;

interface AllAccountInstructionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<AllAccountInstructionsData, undefined>;
}
export const allAccountInstructionsRef: AllAccountInstructionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
allAccountInstructions(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<AllAccountInstructionsData, undefined>;

interface AllAccountInstructionsRef {
  ...
  (dc: DataConnect): QueryRef<AllAccountInstructionsData, undefined>;
}
export const allAccountInstructionsRef: AllAccountInstructionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the allAccountInstructionsRef:
```typescript
const name = allAccountInstructionsRef.operationName;
console.log(name);
```

### Variables
The `AllAccountInstructions` query has no variables.
### Return Type
Recall that executing the `AllAccountInstructions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AllAccountInstructionsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `AllAccountInstructions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, allAccountInstructions } from '@dataconnect/generated';


// Call the `allAccountInstructions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await allAccountInstructions();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await allAccountInstructions(dataConnect);

console.log(data.accountInstructions);

// Or, you can use the `Promise` API.
allAccountInstructions().then((response) => {
  const data = response.data;
  console.log(data.accountInstructions);
});
```

### Using `AllAccountInstructions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, allAccountInstructionsRef } from '@dataconnect/generated';


// Call the `allAccountInstructionsRef()` function to get a reference to the query.
const ref = allAccountInstructionsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = allAccountInstructionsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.accountInstructions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.accountInstructions);
});
```

# Mutations

No mutations were generated for the `example` connector.

If you want to learn more about how to use mutations in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

