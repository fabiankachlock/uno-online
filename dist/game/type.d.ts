export declare type Game = {
    name: string;
    password: string;
    public: boolean;
    hash: string;
    host: string;
    meta: {
        players: number;
        running: boolean;
        player: string[];
        options: {
            penaltyCard: boolean;
            timeMode: boolean;
            striktMode: boolean;
            addUp: boolean;
            cancleWithReverse: boolean;
            placeDirect: boolean;
            takeUntilFit: boolean;
            throwSame: boolean;
            exchange: boolean;
            globalExchange: boolean;
        };
    };
};
export declare type Player = {
    name: string;
    id: string;
};
export declare type GameOptions = {
    name: string;
    password: string;
    public: boolean;
    host: string;
};
