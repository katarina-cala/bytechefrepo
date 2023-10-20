/* tslint:disable */
/* eslint-disable */
/**
 * Definition API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface OAuth2PropertiesModel
 */
export interface OAuth2PropertiesModel {
    /**
     * The redirect URI used for OAuth2 callback URL.
     * @type {string}
     * @memberof OAuth2PropertiesModel
     */
    readonly redirectUri?: string;
    /**
     * The list of predefined OAuth2 apps.
     * @type {Array<string>}
     * @memberof OAuth2PropertiesModel
     */
    readonly predefinedApps?: Array<string>;
}

/**
 * Check if a given object implements the OAuth2PropertiesModel interface.
 */
export function instanceOfOAuth2PropertiesModel(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function OAuth2PropertiesModelFromJSON(json: any): OAuth2PropertiesModel {
    return OAuth2PropertiesModelFromJSONTyped(json, false);
}

export function OAuth2PropertiesModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): OAuth2PropertiesModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'redirectUri': !exists(json, 'redirectUri') ? undefined : json['redirectUri'],
        'predefinedApps': !exists(json, 'predefinedApps') ? undefined : json['predefinedApps'],
    };
}

export function OAuth2PropertiesModelToJSON(value?: OAuth2PropertiesModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
    };
}

