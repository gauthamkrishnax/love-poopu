import { createContext, useContext, useEffect, useState } from 'react';

// Create Context
const AssetContext = createContext();

export const getAsset = (assetName) => {
    const context = useAssets();
    const asset = context.assets.find(asset => asset.name === assetName);
    if (!asset) {
        throw new Error(`Asset ${assetName} not found`);
    }
    return asset.localUri;
}


export function useAssets() {
    const context = useContext(AssetContext);
    if (context === undefined) {
        throw new Error('useAssets must be used within an AssetProvider');
    }
    return context;
}

export const AssetProvider = ({ children, value }) => {
    return (
        <AssetContext.Provider value={value}>
            {children}
        </AssetContext.Provider>
    );
}