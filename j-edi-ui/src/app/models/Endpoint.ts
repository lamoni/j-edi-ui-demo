export interface Endpoint {
    interface: string;
    localAddress: string;
    peerAddress: string;
    deviceName: string;
    neighborAddress?: string;
    inputPolicerName?: string;
    outputPolicerName?: string;
    unit?: string;
    siteIdentifier?: string;
    remoteSiteIdentifier?: string;
    subnet?: string;
    vlanTag?: string;
    innerVlanTag?: string;
    vlanMagic?: string;
    routeDistinguisher?: string;
    outerVlanTag?:string;
}