import * as BasePackageManager from './base';

import * as NPM from './npm';
import * as YARN from './yarn';


export enum PackageManagerType {
    NPM = '';
    YARN = '';
}

export const factory = (packageManagerType: PackageManagerType): typeof BasePackageManager  => {
    switch (packageManagerType) {
        case PackageManagerType.NPM:
            return NPM;
        case PackageManagerType.YARN:
            return YARN;
    }
};

export BasePackageManager;