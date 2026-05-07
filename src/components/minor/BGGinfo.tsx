import React from 'react';
import bggPower from "@/assets/bgg_small.png";

//interface BGGProps  {}
type BGGProps = object;

const BGGInfo: React.FC<BGGProps> = () => {

    return (
        <div className={`bgg-info`}>
            <div className="content">

            </div>
            <div className="powered" style={{width: 200}}>
                <img alt={'Bgg'} src={bggPower} style={{
                    marginBottom: 20,
                    width: '100%'
                }}/>
            </div>
        </div>
    );
};

export default BGGInfo;