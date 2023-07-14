import {NativeConnectionOptions} from '@temporalio/worker';

const tlsServerName = process.env.TEMPORAL_TLS_SERVER_NAME || ''
export const TEMPORAL_CONNECTION_OPTIONS: NativeConnectionOptions = {
    address: process.env.TEMPORAL_SERVER_ADDRESS || undefined,
    tls: tlsServerName ? {
        serverNameOverride: tlsServerName,
    } : null,
};

export const TEMPORAL_NAMESPACE = process.env.TEMPORAL_NAMESPACE || 'default';