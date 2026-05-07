import React from 'react';

interface Props {
    providers: React.ReactElement[];
    children: React.ReactNode;
}

export const ProviderComposer = ({ providers, children }: Props) => {
    return (
        <>
            {providers.reduceRight((acc, provider) => {
                return React.cloneElement(provider as React.ReactElement<{ children: React.ReactNode }>, {
                    children: acc,
                });
            }, children)}
        </>
    );
};